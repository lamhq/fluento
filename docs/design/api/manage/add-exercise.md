# Create Exercise API

## Introduction

- Create an exercise for the authenticated user.

## Contract

- **Type:** REST
- **Signature:** `POST /v1/manage/exercises`
- **Versioning Strategy:** URL path versioning with `/v1/` prefix

### Request Headers

| Name           | Value                      |
| -------------- | -------------------------- |
| `x-user-email` | Authenticated user's email |
| `Content-Type` | `application/json`         |
| `Accept`       | `application/json`         |

### Request Body

Common fields:

| Name         | Type     | Required | Description                                                                                                                              |
| ------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | string   | Yes      | Exercise name.                                                                                                                           |
| `skill`      | string   | Yes      | Skill to practice, enum values defined in [manage data specification](../../../requirements/manage/data.md#skill).                       |
| `format`     | string   | Yes      | Exercise format, value depends on `skill`, defined in [manage data specification](../../../requirements/manage/data.md#exercise-format). |
| `topics`     | string[] | Yes      | At least one topic name; each name must be a non-empty string.                                                                           |
| `references` | string[] | No       | Source references.                                                                                                                       |
| `status`     | string   | Yes      | `active` or `archived`. The client supplies `active` by default.                                                                         |

The request's format-specific fields and requiredness follow the [manage data specification](../../../requirements/manage/data.md#exercise). `topics` is required for every format; `references` is optional.

- Trim scalar content and each array item.
- Remove blank or whitespace-only array entries before validating required lists.
- Allow empty optional `references`.
- Reject:
  - Non-string values and malformed arrays.
  - Missing required fields.
  - Missing or empty `topics` after trimming and removing blank entries.
  - Unsupported skill-format pairs.
  - Content fields that do not apply to the selected format.
  - Unknown body properties.

Example (`communication`):

```json
{
  "name": "Ordering food",
  "skill": "communication",
  "format": "communication",
  "scenario": "Order a meal at a restaurant.",
  "prompts": ["Say that you would like to order a meal."],
  "validResponses": ["I would like to order the grilled salmon, please."],
  "topics": ["Restaurant"],
  "references": [],
  "status": "active"
}
```

### Success Response

**201 Created**

```json
{
  "id": "ex_123",
  "name": "Ordering food",
  "skill": "communication",
  "format": "communication",
  "topics": ["Restaurant"],
  "createdAt": "2026-10-06T02:57:47.000Z",
  "status": "active"
}
```

- The server generates `id` and `createdAt`.
- This endpoint returns a summary; it does not return format-specific content or references.

### Errors

**400 Bad Request — `invalid_request_body`**

- Return this error when body validation fails.
- `details` maps invalid fields to validation messages.

```json
{
  "code": "invalid_request_body",
  "message": "Request validation failed",
  "details": {
    "format": "format must be compatible with skill",
    "prompts": "prompts must contain at least one non-empty value"
  }
}
```

**401 Unauthorized**

Returned when the request has no authenticated user context.

**500 Internal Server Error**

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Unable to create exercise"
}
```

- Do not expose internal database or implementation details in error responses.

## Functional Requirements

- Require authenticated user context identified by `x-user-email`. Associate the created exercise with that user.
- Validate common fields, enums, and the allowed `skill`-`format` combination.
- Validate only fields corresponding to `format`.
- Reject missing, blank, incorrectly typed, or inapplicable content fields.
- Normalize whitespace and remove blank array values before checking required fields.
- Save the selected `status`.
  - The form defaults to `active`; `archived` is also accepted.
- Return the created exercise summary with its server-generated identifier and creation timestamp.

## Non-Functional Requirements

- HTTPS is enforced by API Gateway; the API app does not require HTTPS.
- Prevent users from creating exercises on behalf of another user.
- Return actionable validation errors without exposing internal implementation details.
- Persist common fields and format-specific content consistently with the [Exercise data design](../../data.md).

## Related Documents

- [Create Exercise requirements](../../../requirements/manage/add-exercise.md)
- [Create Exercise dialog](../../web/manage/add-exercise.md)
- [Find Topics API](./find-topics.md)
- [Database Design](../../data.md)

## Changelog

| Date       | Version | Changes                                                               |
| ---------- | ------- | --------------------------------------------------------------------- |
| 2026-10-06 | v1.0    | Initial create exercise API contract with format-specific validation. |
