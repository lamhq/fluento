# Web Application

## Introduction

Web application for the project, built with React, Vite, TypeScript, Tailwind CSS, and Shadcn/ui.

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
cp apps/web/.env.example apps/web/.env
```

## Getting Started

Start the required services first:

```bash
# start Docker (macOS)
open -a Docker

# start required local services
docker compose up -d auth-service api-gateway
```

Start the web application (the api app is automatically started by Turborepo)

```bash
pnpx turbo run web#dev
```

The web app will be available at `http://localhost:5601`.

## Useful commands

Run tests:

```bash
# run all tests
pnpm -F web run test

# run a specific test file (files are relative to `apps/web/`)
pnpm -F web run test src/comm/components/PracticeForm/utils.test
```

Run Lint:

```bash
pnpm -F web run lint
```

Run type check:

```bash
pnpm -F web run type-check
```

Manage dependencies:

```bash
# Add a dependency
pnpm -F web add <dependency>

# Remove a dependency
pnpm -F web remove <dependency>
```

Run a locally installed package binary:

```bash
pnpm -F web exec <command>
```

Examples:

```bash
# run `build` in `web` project
pnpm -F web run build

# add `lodash` to the `web` project
pnpm -F web add lodash

# remove `lodash` from the `web` project
pnpm -F web remove lodash

# run Shadcn UI CLI in the `web` project
pnpm -F web exec shadcn add button
```

## Deploy

Prepare the `.env.<env>` file for the target environment (e.g., `.env.dev`, `.env.prod`).

Create the build at `apps/web/dist/`:

```bash
pnpm -F web run build --mode <env>
```

- `<env>`: The environment to deploy to: `dev`, `prod`.

Deploy the build to runtime environment:

```bash
aws s3 sync apps/web/dist/ s3://<s3-bucket>/web \
  --delete \
  --region <region>

aws cloudfront create-invalidation \
  --distribution-id <cloudfront-distribution-id> \
  --paths "/index.html" \
  --region <region>
```

- `<s3-bucket>`: The S3 bucket name of the target environment
  - for `dev`: `fluento-dev-heron`
  - for `prod`: `fluento-prod-longhorn`
- `<cloudfront-distribution-id>`: The CloudFront distribution ID of the target environment
  - for `dev`: `E14RMK4CW69PS1`
  - for `prod`: `ERJB4PD7UCXWK`
- `<region>`: The AWS region of the target environment. Use `ap-southeast-1` for both `dev` and `prod`

## Project Structure

Application root:

```
apps/web/
├── .env.example                   # Example environment config
├── CHANGELOG.md                   # Package changelog
├── Dockerfile                     # Container image definition
├── README.md                      # App documentation
├── components.json                # Shadcn/ui component config
├── docker/                        # Docker runtime files
├── index.html                     # HTML template
├── package.json                   # Project scripts and dependencies
├── public/                        # Static assets
├── src/                           # Source code
├── tsconfig.app.json              # TypeScript config for `src/*`
├── tsconfig.node.json             # TypeScript config for `vite.config.ts`
├── tsconfig.json                  # Final TypeScript configuration
└── vite.config.ts                 # Vite configuration
```

`apps/web/src/`:

```
apps/web/src/
├── api/                           # API client instance
├── auth/                          # Authentication utilities
├── error/                         # Error handling utilities
├── common/                        # Shared utilities and components
├── shadcn/                        # Shadcn UI generated codes
├── demo/                          # Demo module
├── comm/                          # Communication module
├── main.tsx                       # App entry point
├── App.tsx                        # Root component
├── routes.ts                      # Route definitions
├── constants.ts                   # Shared constants
├── global.css                     # Global styles
├── utils.ts                       # Shared helper functions
└── vite-env.d.ts                  # Vite type definitions
```

## Tech Stack

| Technology   | Purpose                       |
| ------------ | ----------------------------- |
| React 19     | UI library                    |
| Vite         | Build tool and dev server     |
| TypeScript   | Type-safe JavaScript          |
| Tailwind     | Utility-first CSS framework   |
| Shadcn/ui    | Component library             |
| React Router | Client-side routing           |
| React Query  | Server state management       |
| OIDC Client  | OpenID Connect authentication |
| Axios        | HTTP client for API requests  |
| Vitest       | Unit and integration testing  |
