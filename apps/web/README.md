# Web Application

## Introduction

This is the React-based frontend application for the Fluento project. It's a modern web application built with Vite, React 19, TypeScript, and Tailwind CSS.

## Installation

From the root of the project, install dependencies:

```bash
pnpm install
```

Create a `.env` file in the `apps/web` directory by copying from the example file:

```bash
cp .env.example .env
```

Then update the values in `.env` based on your environment:

| Variable              | Description                                             | Default                            |
| --------------------- | ------------------------------------------------------- | ---------------------------------- |
| `VITE_OIDC_AUTHORITY` | URL of the OpenID Connect (OIDC) authority server       | `http://localhost:8080/realms/app` |
| `VITE_OIDC_CLIENT_ID` | Client ID registered with the OIDC provider             | `web-client`                       |
| `VITE_API_BASE_URL`   | Base URL for API requests (can be relative or absolute) | `/api`                             |

## Usage

### Start development server

From the project root, start the web application in development mode:

```bash
pnpm dev
```

Then open http://localhost:5601 in your browser.

Alternatively, from the `apps/web` directory:

```bash
pnpm run dev
```

The application includes a development proxy that forwards API requests from `/api` to the API gateway running on `http://localhost:5602`.

### Build for production

Build the application for production:

```bash
pnpm -F web run build
```

This will compile TypeScript and bundle the application with Vite.

### Preview production build

Preview the production build locally:

```bash
pnpm -F web run start
```

### Run lint

Check code quality and style issues:

```bash
# Lint all files in the web app
pnpm -F web run lint
```

### Type checking

Run TypeScript type checking:

```bash
pnpm -F web run type-check
```

### Run tests

Run unit and integration tests:

```bash
pnpm -F web run test
```

### Format code

Format code using Prettier:

```bash
pnpm -F web run format
```

### Manage dependencies

Add a dependency to the web app:

```bash
pnpm -F web add <package-name>
```

Remove a dependency from the web app:

```bash
pnpm -F web remove <package-name>
```

## Project Structure

```
apps/web/
├── src/                           # Source code
│   ├── api/                       # API client module
│   ├── auth/                      # Authentication logic and OIDC integration
│   ├── common/                    # Common pages, components, utilities
│   ├── demo/                      # Pages and components for demo purposes
│   ├── error/                     # Error handling module
│   ├── App.tsx                    # Root application component
│   ├── main.tsx                   # Application entry point
│   ├── routes.ts                  # Route definitions
│   ├── constants.ts               # Application constants
│   ├── utils.ts                   # Utility functions
│   ├── hooks.ts                   # Custom React hooks used by the application
│   ├── global.css                 # Global styles
│   └── vite-env.d.ts              # Vite environment type definitions
├── public/                        # Static assets
├── docker/                        # For building container with Docker
│   ├── entrypoint.sh              # Docker entrypoint script
│   └── nginx.conf.template        # Nginx configuration for production
├── Dockerfile                     # Docker image definition
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # Final TypeScript configuration
├── tsconfig.app.json              # TypeScript configuration for `src/*`
├── tsconfig.node.json             # TypeScript configuration for `vite.config.ts`
├── index.html                     # HTML template
└── package.json                   # Project dependencies and scripts
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
