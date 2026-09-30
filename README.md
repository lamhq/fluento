# Fluento

## Introduction

This is the Git repository for the Fluento project, a full-stack web application built as a monorepo using Turborepo and pnpm workspaces.

## Prerequisites

- macOS or Linux as development environment
- Docker (for development)
- Node.js v22 (to match with runtime environment)
- pnpm v8

For manual deployment:

- AWS CLI v2.22.x
- AWS credentials

## Installation

Steps:

1. Clone the source code
2. Install dependencies
3. Follow installation instructions in each project `README.md` (`apps/<project>/README.md`)

```bash
git clone <repo-url>
cd fluento
pnpm install
```

You can also run all the applications locally using Docker Compose:

```bash
docker-compose up
```

## Repository Structure

This repository follows the [Turborepo workspace structure](https://c.lamhq.com/se/development/tools/turborepo/workspace-structure.md).

Here's the overall structure of the repository:

```
├── apps/                   # Runnable projects
│   └── <project>/          # See `Available Projects` section
├── docs/                   # Project documentation
├── commitlint.config.mjs   # Commit message linting rules
├── eslint.config.mjs       # ESLint configuration
├── lint-staged.config.mjs  # Pre-commit lint-staged hooks
├── prettier.config.mjs     # Code formatting configuration
├── turbo.json              # Turborepo task pipeline configuration
├── pnpm-workspace.yaml     # pnpm workspace definition
└── package.json            # Root package scripts and dev dependencies
```

**Available Projects**:

| Project       | Description                                   | Techstack                |
| ------------- | --------------------------------------------- | ------------------------ |
| `api`         | Backend API service                           | NestJS, REST, TypeScript |
| `api-gateway` | API Gateway service                           | Node.js, Express         |
| `web`         | Web application                               | React, Vite, TypeScript  |
| `infra`       | Infrastructure code for deploying the project | Terraform                |
| `auth`        | Authentication service                        | Keycloak                 |
| `poc`         | Demo scripts in Python                        |                          |

## Format code

Run the code formatter for files:

```bash
pnpm format <path>
# pnpm format "apps/api/src/**/*.{js,ts}"
# pnpm format "apps/web/src/**/*.{js,ts,tsx}"
# pnpm format apps/api/src/user/infrastructure/mongoose-user.repository.ts
```

## Run lint

Run lint for all files:

```bash
pnpm lint
```

Run lint for specific paths:

```bash
pnpm lint <path> --fix
# pnpm lint apps/web/src/ --fix
# pnpm lint apps/web/src/comm/components/PracticeForm/utils.ts --fix
```

## Run type check

```bash
pnpm -F <project> run type-check
# pnpm -F api run type-check
# pnpm -F web run type-check
```

## Run unit tests

Run unit tests for a project (`web`, `api`):

```bash
pnpm -F <project> test
# pnpm -F web test
```

Run unit tests for files in a project:

```bash
pnpm -F <project> test <pattern>
# pnpm -F web test src/comm/components/PracticeForm/utils
```

## Run package binary

Run a locally installed package binary in a project:

```bash
pnpm -F <project> exec <command>
# pnpm -F web exec shadcn add button
```

## Manage dependencies

Add/remove a dependency for a project:

```bash
pnpm -F <project> add <dependency>

pnpm -F <project> remove <dependency>
```
