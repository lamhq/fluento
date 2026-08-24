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
pnpm run build
```

This will compile TypeScript and bundle the application with Vite.

### Preview production build

Preview the production build locally:

```bash
pnpm run start
```

### Run lint

Check code quality and style issues:

```bash
# Lint all files in the web app
pnpm run lint
```

### Type checking

Run TypeScript type checking:

```bash
pnpm run type-check
```

### Run tests

Run unit tests:

```bash
pnpm run test
```

### Format code

Format code using Prettier:

```bash
pnpm run format
```

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
