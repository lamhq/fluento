# Documentation Structure

## Introduction

This document describes the structure of the `docs` directory, which contains all documentation for the project.

## Folder Structure

```text
docs/
├── project-overview.md
├── ideas/
├── requirements/
└── design/
    ├── api/
    ├── data/
    └── web/
```

## Document Types

| Document                       | Description                                                             | Location                                       |
| ------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------- |
| Project Overview Document      | Provides a high-level overview of the project                           | `docs/project-overview.md`                     |
| Feature Idea Document          | Brainstorming notes for incoming release features                       | `docs/ideas/{module}/{feature-name}.md`        |
| Feature Specification Document | Describes a feature in detail from the end-user's perspective           | `docs/requirements/{module}/{feature-name}.md` |
| API Specification Document     | Describes an API so developers can implement and integrate it correctly | `docs/design/api/{module}/{api-name}.md`       |
| UI Specification Document      | Describes a single screen of a software application                     | `docs/design/web/{module}/{screen-name}.md`    |
| Database Design Document       | Describes the database design of a module                               | `docs/design/data/{module}.md`                 |

`{module}` is a placeholder for the module name.

## Available Modules

The system is divided into several modules, each responsible for a specific aspect of the application.

Here're the available modules:

- **communication**:
  - manage exercises: list, import, add, update, create, delete exercises
  - display exercise for practicing
  - return feedback for learner's response
