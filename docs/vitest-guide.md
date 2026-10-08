# Vitest cheat sheet

Install Vitest and the NestJS/testing utilities as development dependencies:

Run: `pnpm add -D vitest@^4.1.2 @vitest/coverage-v8@^4.1.2 @nestjs/testing@^12.0.1 supertest@^7.0.0 @types/supertest@^7.0.0`

Add these scripts to `package.json`:

```json title="package.json"
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage",
    "test:e2e": "vitest run --config ./vitest.config.e2e.ts"
  }
}
```

Create `vitest.config.ts` for unit tests:

```ts title="vitest.config.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
  },
});
```

Create `vitest.config.e2e.ts` for end-to-end tests:

```ts title="vitest.config.e2e.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
```

For a sample unit test, create `src/app.service.spec.ts`:

```ts title="src/app.service.spec.ts"
import { describe, expect, it } from 'vitest';
import { AppService } from './app.service.js';

describe('AppService', () => {
  it('returns a greeting', () => {
    expect(new AppService().getHello()).toBe('Hello World!');
  });
});
```

Run that test with `pnpm test -- src/app.service.spec.ts`. Run all tests with `pnpm test` (unit), `pnpm test:e2e` (end-to-end), or `pnpm test:cov` (coverage).
