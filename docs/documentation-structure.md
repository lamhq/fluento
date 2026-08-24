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
├── ideas/
│   ├── articulation/
│   │   ├── par-var.md
│   │   ├── sen-con.md
│   │   └── sen-var.md
│   ├── speaking.md
│   └── vocabulary.md
```

- `project-overview.md`: Project Overview Document, covering the high-level product context, goals, and direction.
- `ideas/`: Brainstorming notes, exploratory concepts, and early-stage product or language-learning ideas.
- `requirements/`: Feature Specification Documents, organized by module. Each document describes a product requirement or user-facing feature.
- `design/api/`: API Specification Documents, organized by module. Each document describes the contract and behavior for a related API endpoint or flow.
- `design/web/`: UI Specification Documents, organized by module. Each document describes a screen or interaction pattern for the frontend.
- `design/data/`: Data Model Documents. Each document describes the data shape and relationships for a module.

## Available Modules

- **communication**: managing communication exercises, including retrieving exercises, practicing responses, and submitting answers.
