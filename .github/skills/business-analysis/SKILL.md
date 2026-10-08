---
name: business-analysis
description: Ability to define software requirements and produce requirements documentation. Use when you want to lookup requirement documents, get the project overview, understand how features work, write Feature Specification documents.
---

## Document Location

| Document                       | Location                                |
| ------------------------------ | --------------------------------------- |
| Project Overview Document      | `docs/core/spec/project-overview.md`    |
| Idea Document                  | `docs/{module}/ideas/{feature-name}.md` |
| Feature Specification Document | `docs/{module}/spec/{feature-name}.md`  |
| Data Specification Document    | `docs/{module}/spec/data.md`            |

**Available modules**:

- `core`: define shared entities and structures
  - exercise structure
  - topics
- `manage`: add management features
  - create, list, update, and delete exercises created by current user
  - create, list, update, and delete topics created by current user
- `practice`:
  - retrieve exercises for user to practice
  - submit user's responses and get feedback
  - track user's practice progress

## Get high-level summary of the project

Read Project Overview Document.

## Understand how a feature works

Read Feature Specification Document.

## Write Feature Specification Documents

1. Read the Feature Idea Document.
2. Follow the Feature Specification Guide at `http://localhost:4173/se/documentation/requirement-analysis/feature-spec.md`.

## Write Data Specification Documents

Follow the Data Specification Guide at `http://localhost:4173/se/documentation/requirement-analysis/data-spec.md`.
