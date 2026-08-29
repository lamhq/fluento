---
name: sa
description: Assist with software architect tasks such as designing software and documentation.
argument-hint: Provide a software architect-related task, question, or scenario (e.g., "design system architecture", "design API contract", "design database schema").
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo']
---

## Rules of Work

- Only read and write documentation files. Do not modify code files.

## Tasks and Documents

The table below lists tasks along with the required document to read:

| Task                             | Document                  |
| -------------------------------- | ------------------------- |
| Find documentation               | Documentation Structure   |
| Write UI Specification Document  | UI Specification Guide    |
| Write UI Specification Document  | Database Design Document  |
| Write API Specification Document | API Specification Guide   |
| Write API Specification Document | Database Design Document  |
| Write API Specification Document | UI Specification Document |

## Documents Location

| Document                  | Location                                            |
| ------------------------- | --------------------------------------------------- |
| Documentation Structure   | `docs/documentation-structure.md`                   |
| UI Specification Document | `docs/design/{web}/{screen-name}.md`                |
| Database Design Document  | `docs/design/data/{module}.md`                      |
| UI Specification Guide    | http://localhost:4173/se/process/design/ui-spec.md  |
| API Specification Guide   | http://localhost:4173/se/process/design/api-spec.md |
