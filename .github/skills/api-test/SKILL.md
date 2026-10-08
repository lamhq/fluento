---
name: api-test
description: API testing skills. Use when you want to run, write API tests.
---

## Run API tests

Refer to `Run end-to-end tests` section in `apps/api/README.md`.

## Setup

For a NestJS and MongoDB API, install the packages used by these examples:

<PackageManagerTabs command="install -D vitest@^4.1.11 supertest@^7.0.0 @types/supertest@^7.0.0 @nestjs/testing@^12.1.2 testcontainers@^12.0.4 mongodb@^6.12.0 zod@^4.4.3 dotenv@^16.0.3" />

- `vitest`: test runner
- `supertest`: making HTTP requests
- `@nestjs/testing`: NestJS test utilities
- `testcontainers`: launch fake third-party services for testing
- `mongodb`: for database seeding
- `zod`: validate API response
- `dotenv`: to load secrets and credentials from environment variables

Dependencies are installed as development dependencies since they are only needed for testing.

## Test files organization

Group tests by module, then by logical group, finally the test file:

```text title="tests/<module>/<group>/<operation>.spec.ts"
tests/
├── <module>/
│   ├── <group>/
│   │   └── <operation>.spec.ts
│   └── <other-feature>/
│       └── <other-operation>.spec.ts
└── <another-module>/
    └── <feature>/
        └── <operation>.spec.ts
```

Examples:

- `<module>`: `auth`, `checkout`, `catalog`, etc.
- `<group>`: `product`, `category`, `order`, etc.
- `<operation>`: `find-products`, `create-product`, `delete-product`, `get-product-by-id`, etc.

## Test naming

Use lowercase kebab-case names ending in `.spec.ts`. Name each test file for the operation it covers.

## Test structure

Use:

- an outer `describe` for the API operation
- nested `describe` blocks for behavior groups
- `it` cases that state expected outcomes.

Begin each case name with `should`.

Keep each test focused on one behavior.

Examples:

```ts title="tests/manage/product/find-products.spec.ts"
describe('find products', () => {
  describe('filtering', () => {
    it('should return active products', async () => {
      // Arrange, call the API, and assert response and persisted state.
    });
  });

  describe('sorting', () => {
    it('should sort products by name', async () => {
      // Assert the sorting response.
    });
  });

  describe('pagination', () => {
    it('should return first 10 products', async () => {
      // Assert the pagination response.
    });
  });
});
```

Use `it.each` for related cases that share setup and assertions but vary by input:

```ts title="tests/manage/product/create-product.spec.ts"
describe('create product', () => {
  it.each([
    { invalidField: 'name', body: { price: 10 } },
    { invalidField: 'price', body: { name: 'Test product' } },
    { invalidField: 'price', body: { name: 'Test product', price: -1 } },
  ])('should reject a request with invalid $invalidField', async ({ body }) => {
    await request(app.getHttpServer()).post('/v1/products').send(body).expect(400);
  });
});
```

## Run fake services

The API relies on third-party services (database, cache, message broker, etc.). To keep the test environment close to production, end-to-end tests use local instances of these services instead of mocks.

Those services are started and initialized in the global setup file registered in the Vitest config:

```ts title="vitest.config.e2e.ts"
export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    globalSetup: ['./test/vitest.global-setup.ts'],
    fileParallelism: false,
  },
});
```

Here's how a MongoDB replica set is set up and run:

```ts title="test/vitest.global-setup.ts"
import path from 'path';
import { GenericContainer, Wait } from 'testcontainers';

export default async function startMongoDB() {
  const container = await new GenericContainer('mongo:4.2')
    .withEnvironment({
      MONGO_INITDB_ROOT_USERNAME: 'admin',
      MONGO_INITDB_ROOT_PASSWORD: '<password>',
      MONGO_INITDB_DATABASE: 'test',
    })
    .withExposedPorts({ host: 27017, container: 27017 })
    .withCopyFilesToContainer([
      {
        source: path.resolve(__dirname, '../../db/init-rs.js'),
        target: '/docker-entrypoint-initdb.d/init-rs.js',
      },
    ])
    .withCommand(['--replSet', 'rs0', '--bind_ip_all'])
    .withWaitStrategy(Wait.forLogMessage('waiting for connections'))
    .start();

  // Initialize the replica set
  await container.exec([
    'mongo',
    process.env.MONGODB_CONNECTION_STRING,
    '/docker-entrypoint-initdb.d/init-rs.js',
  ]);

  // The full setup waits for the "database writes are now permitted" log line
  // before resolving.
}
```

## Create NestJS app for testing

Create a NestJS application instance for testing. Apply the same versioning, global validation, and exception-handling configuration used by the running API.

```ts title="tests/utils/test.ts"
import { INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { ClassValidorPipe } from '../../src/common/error/class-validator.pipe';
import { ExceptionFilter } from '../../src/common/error/exception.filter';

export function setUpApiTest() {
  let app!: INestApplication;

  beforeAll(async () => {
    // create NestJS app
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'v',
    });
    app.useGlobalPipes(new ClassValidorPipe());
    app.useGlobalFilters(new ExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    // close NestJS application
    await app.close();
  });

  return {
    getApp: () => app,
  };
}
```

Use the helper in a test file to send requests to the app and assert the response:

```ts title="tests/<module>/<feature>/<operation>.spec.ts"
import request from 'supertest';

import { setUpApiTest } from '../../utils/test';

describe('list resources', () => {
  const { getApp } = setUpApiTest();

  it('should return resources', async () => {
    const response = await request(getApp().getHttpServer())
      .get('/v1/resources')
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
  });
});
```

## Create APIcredentials

This section describes how to seed a test user for API requests that require authentication.

The test user is inserted into the database before tests run and removed after all tests complete. Tests access it through the `getUser()` helper.

The user's information can be used to generate an API access token for authenticated requests.

```ts title="tests/utils/test.ts"
import { ObjectId } from 'mongodb';

import { connect, insert, deleteMany, disconnect } from './mongodb';

export function setUpApiTest() {
  // Unique per suite, so the test user does not collide with other suites.
  const cleanupMarker = `#ApiTest-${Date.now().toString(36)}`;

  let user!: { email: string; id: ObjectId };

  beforeAll(async () => {
    // Seed the test user in the database
    const email = `learner-${cleanupMarker}@example.com`;
    const insertedUser = await insert('users', { email });
    user = { email, id: insertedUser._id };

    // ...
  });

  afterAll(async () => {
    // remove test user from the database
    await deleteMany('users', { email: user.email });

    // ...
  });

  return {
    getUser: () => user,
    getApp: () => app,
  };
}
```

To access the test user, call `getUser()` inside each test:

```ts title="tests/manage/topic/get-topics.spec.ts"
import request from 'supertest';

import { setUpApiTest } from '../../utils/test';

describe('get topics', () => {
  const { getApp, getUser } = setUpApiTest();

  it('should return topics of the current user', async () => {
    const { email } = getUser();

    const response = await request(getApp().getHttpServer())
      .get('/v1/practice/topics')
      .set('x-user-email', email)
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
  });
});
```

## Seed & cleanup test data

To seed test data for a specific test, insert the necessary records into the database within the test itself. Use a unique marker to identify and clean up these records after the test completes:

```ts title="tests/<module>/<feature>/<operation>.spec.ts"
import { insertMany, deleteMany } from '../../utils/db';
import { setUpApiTest } from '../../utils/test';

describe('list resources', () => {
  const { cleanupMarker } = setUpApiTest();

  beforeEach(async () => {
    await insertMany('resources', [
      {
        name: 'Test resource',
        tags: [cleanupMarker],
      },
    ]);
  });

  it('should return the matching resource', async () => {
    // Call the API and assert its response.
  });

  afterEach(async () => {
    await deleteMany('resources', {
      tags: cleanupMarker,
    });
  });
});
```

## Validate API responses

Define a Zod schema for the public response shape in a separate `<operation>.schema.ts` file next to the spec, then import it in the test, parse the HTTP response body, and assert on the parsed result:

```ts title="tests/<module>/<feature>/<operation>.schema.ts"
import { z } from 'zod';

export const resourceResponseSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  tags: z.array(z.string()),
  createdAt: z.iso.datetime(),
});
```

```ts title="tests/<module>/<feature>/<operation>.spec.ts"
import request from 'supertest';

import { resourceResponseSchema } from './<operation>.schema';

it('should return a valid resource response', async () => {
  const response = await request(app.getHttpServer())
    .post('/v1/resources')
    .send({
      name: 'Test resource',
      tags: ['sample'],
    })
    .expect(201);

  const body = resourceResponseSchema.parse(response.body);
  expect(body.name).toBe('Test resource');
});
```

## Verify database state

When an API operation changes persistent state, query the database to ensure post-conditions of test cases are met. Assert saved fields and relationships, or verify deletion:

```ts title="tests/<module>/<feature>/<operation>.spec.ts"
import { findById } from '../../utils/db';

const savedResource = await findById('resources', body.id);

expect(savedResource).toEqual(
  expect.objectContaining({
    ownerId: user.id,
    name: 'Test resource',
  }),
);
```

For deletion, query by ID after the request and assert the record is absent. Check related collections when the operation should update or remove dependent records.
