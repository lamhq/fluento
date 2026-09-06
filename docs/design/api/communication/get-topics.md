# Get Topics API

## Introduction

Retrieve a list of topics created by the user for categorizing and filtering communication exercises.

## Contract

- **Type:** REST
- **Signature:** `GET /v1/practice/topics`
- **Versioning Strategy:** URL path versioning with `/v1/` prefix

### Request Headers

| **Name**     | **Value**          |
| ------------ | ------------------ |
| x-user-email | `test@example.com` |
| Accept       | application/json   |

### Query Parameters

No query parameters are supported for this endpoint. All available topics are returned sorted by name in ascending order.

### Response

**Success (200 OK):**

```json
[
  {
    "id": "topic_004",
    "name": "Communication",
    "createdAt": "2026-01-10T08:45:00Z"
  },
  {
    "id": "topic_003",
    "name": "Grammar",
    "createdAt": "2026-01-10T08:30:00Z"
  },
  {
    "id": "topic_005",
    "name": "Restaurant",
    "createdAt": "2026-01-10T09:00:00Z"
  },
  {
    "id": "topic_002",
    "name": "Speaking",
    "createdAt": "2026-01-10T08:15:00Z"
  },
  {
    "id": "topic_001",
    "name": "Vocabulary",
    "createdAt": "2026-01-10T08:00:00Z"
  }
]
```

**Error (500 Internal Server Error):**

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Unable to retrieve topics",
  "details": "Database connection timeout"
}
```

## Functional Requirements

- **User Identification:** Require the `x-user-email` header to identify the authenticated request context.
- **Topic List Retrieval:** Return all topics sorted by name in ascending order. The current implementation does not filter topics by the authenticated user.
- **Consistent Format:** Return topic objects with id, name, and createdAt fields.
- **Empty Results:** Return empty array if the user has not created any topics.

## Non-Functional Requirements

- **Performance:** Return topic list in under 200 ms for typical queries under normal traffic conditions.
- **Security:** All traffic must use HTTPS.
- **Reliability:** Gracefully handle server errors and return descriptive error responses without leaking internal implementation details.
- **Scalability:** Support growth in topic volume and concurrent user requests.

## Changelog

| **Date**   | **Version** | **Changes**                                             |
| ---------- | ----------- | ------------------------------------------------------- |
| 2026-08-30 | v1.0        | Initial release of the endpoint for listing all topics. |
