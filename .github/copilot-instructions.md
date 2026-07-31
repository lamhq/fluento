## Rules of Work

1. **Read the documentation first**: Before writing code, review the documentation to gain the necessary context for your work.
2. **List all documentation used**: At the end, provide a list of all documentation you referenced while completing your work.
3. **Always run project-specific commands in the root directory** with `pnpm -F <project> exec <command>`.
4. **Run linting and type checking last**: After writing code, run linting and type checking to ensure your code is valid.

## Documentation Index

This section lists all project documentation.

:::note
All file paths are relative to the project root.
:::

### Repository Guide

- **Use when you need to**:
  - Start applications (web, API, etc.)
  - Run linting
  - Run type checking
  - Execute commands (Prisma, Playwright, etc.)
  - Manage dependencies (add/remove project dependencies)
  - Understand the root repository structure
  - Identify available projects
  - Review Docker Compose configuration
- **Location**: `README.md`

### Web Application Guide

- **Use when you need to**:
  - Understand the repository structure
  - Get tech stack information
- **Location**: `apps/web/README.md`

### API Guide

- **Use when you need to**:
  - Understand the repository structure
  - Get tech stack information
- **Location**: `apps/api/README.md`
