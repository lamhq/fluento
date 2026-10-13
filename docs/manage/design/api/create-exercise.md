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

**Common fields**:

| Name         | Type     | Required | Description                                                                                                    |
| ------------ | -------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `format`     | string   | Yes      | Exercise format, enum values defined in [core data specification](../../../core/spec/data.md#exercise-format). |
| `topics`     | string[] | Yes      | At least one topic name; each name must be a non-empty string.                                                 |
| `references` | string[] | No       | Optional source references; when supplied, must contain at least one non-empty text item.                      |
| `status`     | string   | Yes      | `active` or `archived`. The client supplies `active` by default.                                               |

**Other format-specific fields** and **Validation constraints** follow the [core data specification](../../../core/spec/data.md#format-specific-fields).

**Normalizations**:

- Trim scalar content and each array item.
- Generate `name` according to the [Exercise Name Mapping](../../../core/spec/data.md#exercise-name-mapping).
- Infer `skill` from `format` using the [Format-Skill Mapping](../../../core/spec/data.md#format-skill-mapping).
- Remove blank or whitespace-only array entries before validating lists.

### Example (`communication`)

```json
{
  "format": "communication",
  "scenario": "Order a meal at a restaurant.",
  "prompts": ["Say that you would like to order a meal."],
  "validResponses": ["I would like to order the grilled salmon, please."],
  "topics": ["Restaurant"],
  "references": ["https://example.test/source"],
  "status": "active"
}
```

### Success Response

**201 Created**

```json
{
  "id": "ex_123",
  "name": "Order a meal at a restaurant.",
  "skill": "communication",
  "format": "communication",
  "topics": ["Restaurant"],
  "createdAt": "2026-10-06T02:57:47.000Z",
  "status": "active"
}
```

- The server generates `id` and `createdAt`, and derives `name` and `skill` from the request's format-specific content and `format`.
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
    "format": "Invalid exercise format",
    "prompts": "prompts must contain at least one non-empty value"
  }
}
```

**401 Unauthorized**

Returned when the request has no authenticated user context.

**500 Internal Server Error**

```json
{
  "code": "internal_error",
  "message": "An unexpected error occurred. Please try again later."
}
```

- Do not expose internal database or implementation details in error responses.

## Functional Requirements

- Require authenticated user context identified by `x-user-email`. Associate the created exercise with that user.
- Validate common fields and the exercise format.
- Generate `name` according to the [Exercise Name Mapping](../../../core/spec/data.md#exercise-name-mapping).
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
- Persist common fields and format-specific content consistently with the [core data specification](../../../core/spec/data.md).

## Related Documents

- [Create Exercise Feature Specification](../../spec/create-exercise.md)
- [Create Exercise dialog](../web/create-exercise-dialog.md)
- [Find Topics API](./find-topics.md)
- [Core Exercise Data Specification](../../../core/spec/data.md)

## Changelog

| Date       | Version | Changes                                                               |
| ---------- | ------- | --------------------------------------------------------------------- |
| 2026-10-06 | v1.0    | Initial create exercise API contract with format-specific validation. |
| 2026-10-12 | v1.1    | Use format as the exercise type selector.                             |
| 2026-10-12 | v1.2    | Generate exercise name from format-specific content.                  |
