## Rules of Work

1. **Read documentation first**: Review the **Documentation Index** section below to know which documentation is relevant to your work.

2. **List all documentation used**: At the end, provide a list of the documentation you referenced while completing the work.

3. **Always run commands from the root directory**:
   - To run NPM scripts, use: `pnpm -F <project> run <script>`
   - To run binaries or CLIs, use: `pnpm -F <project> exec <command>`

4. **Run linting and type checking last**: after modifying code, run linting and type-checking commands.

## Documentation Index

This section lists all project documentation.

:::note
All file paths are relative to the project root.
:::

### Documentation Structure Guide

- **Use when you need to** find the right documentation:
  - Project Overview Document
  - Feature Specification Document
  - UI Specification Document
  - API Specification Documents
  - Data Model Document
  - Architecture Overview Document
  - Component Design Documents
- **Location**: `docs/documentation-structure.md`

### Repository Guide

- **Use when you need to**:
  - Start applications locally (web, API, etc.)
  - Run linting
  - Run type checking
  - Execute commands (Prisma, Playwright, etc.)
  - Manage application's dependencies
  - Understand repository structure
  - Identify available projects
  - Review Docker Compose configuration
- **Location**: `README.md`

### Web Application Guide

- **Use when you need to** understand the repository structure of the web app
- **Location**: `apps/web/README.md`

### API Application Guide

- **Use when you need to** understand the repository structure of the API app
- **Location**: `apps/api/README.md`
