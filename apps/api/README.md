# API Application

## Introduction

This is the backend service for the Fluento project. It is built with NestJS, TypeScript, and Node.js, and serves as the API layer for the web application.

## Installation

From the root of the project, install dependencies:

```bash
pnpm install
```

Create a `.env` file in the `apps/api` directory and add any environment variables required by your local setup. A typical example is:

```bash
PORT=5600
```

## Usage

### Start development server

Follow instructions in the root `README.md`.

### Build for production

Build the application for production:

```bash
pnpm -F api run build
```

### Start production build

Run the built application locally:

```bash
pnpm -F api run start
```

### Run lint

Check code quality and style issues:

```bash
pnpm lint apps/api
```

### Type checking

Run TypeScript type checking:

```bash
pnpm -F api run type-check
```

### Run tests

Run unit tests:

```bash
pnpm -F api run test
```

Run end-to-end tests:

```bash
pnpm -F api run test:e2e
```

### Format code

Format code using Prettier:

```bash
pnpm -F api run format
```

### Manage dependencies

Add a dependency to the API app:

```bash
pnpm -F api add <package-name>
```

Remove a dependency from the API app:

```bash
pnpm -F api remove <package-name>
```

## Project Structure

```text
apps/api/
├── src/                           # Application source code
│   ├── app.controller.ts         # Main controller
│   ├── app.module.ts             # Root application module
│   ├── app.service.ts            # Core service logic
│   ├── app.ts                    # Nest application factory
│   ├── lambda.ts                 # AWS Lambda entry point
│   ├── healthcheck.mjs           # Healthcheck script
│   └── main.ts                   # Application entry point
├── test/                          # End-to-end tests
├── Dockerfile                     # Docker image definition
├── esbuild.mjs                    # Build configuration for esbuild
├── nest-cli.json                  # Nest CLI configuration
├── tsconfig.json                  # TypeScript configuration
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
