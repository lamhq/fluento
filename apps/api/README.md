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

## Testing

```bash
# Unit tests
pnpm -F api run test

# API tests
pnpm -F api run test:e2e
```

## Deploy

Create the production build at `apps/api/dist/`:

```bash
pnpm -F api run build
```

Create the deployment package:

```bash
cd apps/api/dist/ && zip -r ../../../api.zip . && cd ../../../
```

Update the lambda function and wait for the update to complete:

```bash
aws lambda update-function-code \
  --function-name fluento-<env>-api-handler \
  --zip-file fileb://api.zip \
  --region ap-southeast-1

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

### Get logs

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
| AWS Lambda | Serverless function runtime  |
