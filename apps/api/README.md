# API

## Introduction

API service for the project. It is built with NestJS, TypeScript, and Node.js. Deployable as AWS Lambda function or standalone container.

## Installation

:::note
All commands should be executed in the root directory
:::

Install dependencies:

```bash
pnpm install
```

Create `.env` file, then fill in the required values:

```bash
cp apps/api/.env.example apps/api/.env
```

## Getting Started

Start the database service first:

```bash
# start Docker (macOS)
open -a Docker

# start database service (MongoDB)
docker compose up -d db-service
```

Start the API application in development mode:

```bash
pnpx turbo run api#dev
```

The API will be available at `http://localhost:5600`.

To start the production build locally:

```bash
pnpm -F api run build
pnpm -F api run start
```

## Run end-to-end tests

Run all end-to-end tests (require Docker):

```bash
pnpm -F api test:e2e
```

Run end-to-end tests for specific files:

```bash
pnpm -F api test:e2e <pattern>
# pnpm -F api test:e2e delete-exercise.spec.ts
```

## Deploy

Create the production build at `apps/api/dist/`:

```bash
pnpm -F api run build
```

Create the deployment package:

```bash
# go to the build output directory
cd apps/api/dist/

# remove unnecessary files
rm main.js main.js.map

# create a zip in the root directory
zip -r ../../../api.zip .

# go back to the root directory
cd ../../../
```

Update the lambda function and wait for the update to complete:

```bash
# update the lambda function
aws lambda update-function-code \
  --function-name fluento-<env>-api-handler \
  --zip-file fileb://api.zip \
  --region ap-southeast-1 \
  --no-cli-pager

# wait for the update to complete
aws lambda wait function-updated \
  --function-name fluento-<env>-api-handler \
  --region ap-southeast-1
```

:::note
Replace `<env>` with the target environment (`dev`, `prod`)
:::

Clean up:

```bash
rm api.zip
```

## Troubleshooting

### Get AWS Lambda logs

Get runtime logs from AWS Lambda for debugging:

```bash
aws logs tail /aws/lambda/fluento-dev-api-handler --since 10m
```

### Port Already in Use

If port 5600 is already in use:

```bash
# Find and kill process using the port
lsof -ti tcp:5600 | xargs kill -9
```

Or change the `PORT` in `.env`.

### Database Connection Issues

Ensure MongoDB service is running:

```bash
docker compose up -d db-service
```

Check the `DATABASE_URL` environment variable is correctly configured.

## Project Structure

```text
apps/api/
├── src/                           # Application source code
│   ├── healthcheck.mjs            # Healthcheck script
│   ├── app.ts                     # Nest application factory
│   ├── lambda.ts                  # AWS Lambda entry point
│   └── main.ts                    # Application entry point
├── test/                          # API tests
├── Dockerfile                     # Docker image definition
├── esbuild.mjs                    # Build configuration for esbuild
├── nest-cli.json                  # Nest CLI configuration
├── tsconfig.json                  # TypeScript configuration
├── CHANGELOG.md                   # Release notes and version history
└── package.json                   # Project dependencies and scripts
```

## Tech Stack

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| NestJS     | Backend framework            |
| Node.js    | Runtime environment          |
| TypeScript | Type-safe JavaScript         |
| Jest       | Unit and integration testing |
| Supertest  | HTTP endpoint testing        |
| esbuild    | Fast application bundling    |
| Docker     | Containerization             |
| LangChain  | LLM orchestration            |
| Mongoose   | MongoDB object modeling      |
| MongoDB    | Database                     |

## Architecture Decision Records

### Disable esbuild minification for NestJS Builds

**Context**:

The API is built with NestJS, which relies on decorator metadata and runtime reflection to register modules, controllers, and providers. During bundling, minifying the output changed class names and metadata in ways the dependency injection container could not resolve, causing startup failures.

**Decision**:

We will keep esbuild minification disabled for the API build by setting `minify: false` in the build configuration.

**Consequences**:

- Positive: NestJS starts reliably, dependency injection resolves correctly, and runtime behavior remains stable.
- Negative: The generated bundle is larger than a minified build, but the reliability tradeoff is preferred for this application.

### Package `@langchain/openai` in a Lambda Layer

**Context**:  
LangChain loads `@langchain/openai` via dynamic imports, which fail in the bundled Lambda since `node_modules` isn’t shipped.

**Decision**:  
Install `@langchain/openai` in `node_modules` and ship that directory as a dedicated Lambda layer.

**Consequences**:

- **Positive**: OpenAI integrations work without resolution errors.
- **Negative**: Adds an extra deployment artifact (the layer).
