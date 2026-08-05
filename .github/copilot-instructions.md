## Rules of Work

1. **Read the documentation first**: Review the **Documentation Index** section below to know which documentation is relevant to your work.
2. **List all documentation used**: At the end, provide a list of the documentation you referenced while completing the work.
3. **Run workspace commands from the repository root** with `pnpm -F <project> ...`; use `pnpm -F <project> run <script>` for package scripts and `pnpm -F <project> exec <command>` for binaries or CLIs.
4. **Run linting and type checking last**: After implementing the change, run the relevant linting and type-checking steps to verify the result.

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

### Documentation Structure Guide

- **Use when you need to**:
  - Understand how the documentation folder is organized
  - Find the right documentation location for new or updated docs
  - Keep documentation aligned with the current docs structure
- **Location**: `docs/documentation-structure.md`
