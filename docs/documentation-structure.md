# Documentation Structure

## Introduction

This document describes the structure of the `docs` directory, which contains all documentation for the project.

## Folder Structure

```text
docs/
├── documentation-structure.md
├── project-overview.md
├── requirements/
│   └── communication/
│       └── practice-communication.md
├── design/
│   ├── api/
│   │   └── communication/
│   │       ├── get-exercises.md
│   │       └── submit-response.md
│   ├── data/
│   │   └── communication.md
│   └── web/
│       └── communication/
│           └── practice-communication.md
├── implementation/
│   └── api/
│       └── prisma.md
├── ideas/
│   ├── articulation/
│   │   ├── par-var.md
│   │   ├── sen-con.md
│   │   └── sen-var.md
│   ├── speaking.md
│   └── vocabulary.md
```

- `project-overview.md`: Project Overview Document, with high-level product context, vision, and goals.
- `requirements/`: Feature Specification Documents, organized by module. Each document defines a feature in detail.
- `design/api/`: API Specification Documents, organized by module. Each document describes an API.
- `design/web/`: UI Specification Documents, organized by module. Each document describes a screen.
- `design/data/`: Data Model Documents. Each document describes the data model of a module.
- `implementation/`: Reserved for future implementation details and technical documentation.
- `ideas/`: Brainstorming notes and exploratory concepts.

## Available Modules

- **communication**: managing communication exercises, including retrieving exercises and submitting responses.
