# Find Topics API

## Introduction

Retrieve public topics and topics created by the authenticated user for categorizing and filtering exercises.

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

No query parameters are supported.

### Response

**Success (200 OK):**

```json
[
  {
    "id": "topic_003",
    "name": "Airport",
    "createdAt": "2026-10-01T09:00:00.000Z"
  },
  {
    "id": "topic_005",
    "name": "Restaurant",
    "createdAt": "2026-10-02T09:00:00.000Z"
  },
  {
    "id": "topic_004",
    "name": "Travel",
    "createdAt": "2026-10-03T09:00:00.000Z"
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
- **Topic List Retrieval:** Return topics whose visibility is `public` or whose owner is the authenticated user. Remove duplicated topic names.
- **Ordering:** Sort the deduplicated list by name in ascending, case-insensitive alphabetical order.
- **Consistent Format:** Return topic objects with `id`, `name`, and `createdAt`.
- **Empty Results:** Return an empty array when no public topics or user-owned topics are available.

## Non-Functional Requirements

- **Performance:** Return topic list in under 200 ms for typical queries under normal traffic conditions.
- **Security:** API Gateway enforces HTTPS; the API app does not require HTTPS.
- **Reliability:** Gracefully handle server errors and return descriptive error responses without leaking internal implementation details.
- **Scalability:** Support growth in topic volume and concurrent user requests.

## Changelog

| **Date**   | **Version** | **Changes**                                             |
| ---------- | ----------- | ------------------------------------------------------- |
| 2026-08-30 | v1.0        | Initial release of the endpoint for listing all topics. |
