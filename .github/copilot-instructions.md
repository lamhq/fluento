## Rules of Work

Follow these rules for every task:

- Read the relevant documentation before doing anything.
- Read code files only if documentation is insufficient.
- At the end of the response, list every document referenced while working.

## Document List

Project documents and their purposes:

| Document                       | Description                                      |
| ------------------------------ | ------------------------------------------------ |
| Root README                    | Monorepo overview and project structure          |
| API README                     | API project guide                                |
| Web README                     | Web project guide                                |
| Infrastructure README          | Deployment and infrastructure guide              |
| Project Overview Document      | High-level project summary                       |
| Feature Idea Document          | Early ideas for upcoming features                |
| Feature Specification Document | End-user feature requirements                    |
| Feature Specification Guide    | Guide for writing Feature Specification Document |
| API Specification Document     | API contract and behavior                        |
| API Specification Guide        | Guide for writing API Specification Document     |
| UI Specification Document      | Describes an UI screen for implementation        |
| UI Specification Guide         | Guide for writing UI Specification Document      |
| Database Design Document       | Database design of a module                      |
| Database Design Guide          | Guide for writing Database Design Document       |
| API Design Standards           | API conventions and standards                    |

## Document Location

| Document                       | Location                                                                |
| ------------------------------ | ----------------------------------------------------------------------- |
| Root README                    | `README.md`                                                             |
| API README                     | `apps/api/README.md`                                                    |
| Web README                     | `apps/web/README.md`                                                    |
| Infrastructure README          | `apps/infra/README.md`                                                  |
| Project Overview Document      | `docs/project-overview.md`                                              |
| Feature Idea Document          | `docs/ideas/{module}/{feature-name}.md`                                 |
| Feature Specification Document | `docs/requirements/{module}/{feature-name}.md`                          |
| API Specification Document     | `docs/design/api/{module}/{api-name}.md`                                |
| UI Specification Document      | `docs/design/web/{module}/{screen-name}.md`                             |
| Database Design Document       | `docs/design/data/{module}.md`                                          |
| Feature Specification Guide    | http://localhost:4173/se/process/requirements/feature-spec.md           |
| UI Specification Guide         | http://localhost:4173/se/process/design/ui-spec.md                      |
| API Specification Guide        | http://localhost:4173/se/process/design/api-spec.md                     |
| Database Design Guide          | http://localhost:4173/se/process/design/db-design.md                    |
| API Design Standards           | http://localhost:4173/se/process/implementation/api-design-standards.md |

`{module}` is a placeholder for the module name.

## Modules

Everything in the project (including documents) is organized into modules. Each module has its own purpose and responsibilities. The following modules are available in the project:

- **communication**:
  - list exercises
  - import exercises
  - add, update, and delete exercises
  - display exercises for practice
  - return feedback for learner's answers

## Tasks

All tasks and the relevant documents to read for context:

| Task                         | Document    |
| ---------------------------- | ----------- |
| Understand project structure | Root README |
| Identify available projects  | Root README |
| Run lint                     | Root README |
| Run type check               | Root README |
| Run unit tests               | Root README |
| Run package's binary         | Root README |
| Manage dependencies          | Root README |
| Review Docker Compose file   | Root README |
