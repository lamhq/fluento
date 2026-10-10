# Find Exercises API

## Introduction

Retrieve a paginated list of exercises created by the authenticated user. Apply the list screen's filters and sorting on the backend so the client does not need to fetch or filter the full collection.

## Contract

- **Type:** REST
- **Signature:** `GET /v1/manage/exercises`
- **Versioning Strategy:** URL path versioning with `/v1/` prefix

### Request Headers

| **Name**     | **Value**                  |
| ------------ | -------------------------- |
| x-user-email | Authenticated user's email |
| Accept       | application/json           |

### Query Parameters

| **Name** | **Type**           | **Required** | **Description**                                                                                                                                                                                   |
| -------- | ------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name     | string             | No           | Case-insensitive contains match against the exercise name.                                                                                                                                        |
| topics   | string, repeatable | No           | Filter by selected topic names (e.g., `?topics=Travel&topics=Food`). Multiple values use OR matching.                                                                                             |
| skills   | string, repeatable | No           | Filter by selected skills. Supported values: `communication`, `vocabulary`, `articulation`. Multiple values use OR matching.                                                                      |
| formats  | string, repeatable | No           | Filter by selected formats. Supported values: `word`, `sentence`, `paragraph`, `communication`. Multiple values use OR matching.                                                                  |
| status   | string, repeatable | No           | Filter by selected statuses. Supported values: `active`, `archived`. Multiple values use OR matching.                                                                                             |
| sort     | string             | No           | Ordered, comma-separated sort fields: `name` and `createdAt`. Prefix a field with `-` for descending order (e.g., `name,-createdAt`). Earlier fields take priority. Defaults to `name` ascending. |
| offset   | integer            | No           | Number of matching items to skip. Default: `0`. Must be non-negative.                                                                                                                             |
| limit    | integer            | No           | Maximum number of items to return. Default: `10`. Must be positive.                                                                                                                               |

Filters from different parameters are combined with AND logic. For each repeatable parameter, matching any selected value is sufficient. An omitted or empty filter does not restrict results.

### Response

**Success (200 OK):**

```json
{
  "total": 45,
  "offset": 0,
  "limit": 10,
  "items": [
    {
      "id": "ex_456",
      "name": "Coffee Shop Order",
      "skill": "communication",
      "format": "communication",
      "topics": ["Vocabulary", "Speaking"],
      "createdAt": "2026-08-10T09:30:00.000Z",
      "status": "active"
    },
    {
      "id": "ex_457",
      "name": "Business Meeting",
      "skill": "communication",
      "format": "communication",
      "topics": ["Grammar", "Communication"],
      "createdAt": "2026-08-08T09:30:00.000Z",
      "status": "archived"
    }
  ]
}
```

| **Response Field** | **Description**                                   |
| ------------------ | ------------------------------------------------- |
| `total`            | Total number of matching items before pagination. |
| `offset`           | Number of matching items skipped.                 |
| `limit`            | Maximum number of items returned.                 |
| `items`            | Exercises matching the filters and pagination     |

**Error (400 Bad Request):**

```json
{
  "code": "invalid_request_params",
  "message": "Request validation failed",
  "details": {
    "status": "status must be one of: active, archived"
  }
}
```

**Error (500 Internal Server Error):**

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Unable to retrieve exercises"
}
```

Do not include internal database or implementation details in error responses.

## Functional Requirements

- **User Isolation:** Return only exercises owned by the authenticated user. Apply user scoping independently of filters, sorting, and pagination.
- **Name Filtering:** Match the `name` field case-insensitively when it contains the supplied value.
- **Multi-Select Filtering:** Accept repeated `topics`, `skills`, `formats`, and `status` query parameters. Match OR within each parameter and AND across different parameters.
- **Topic Options:** Topic filter values are topic names supplied by the topics API.
- **Sorting:** Support `name` and `createdAt`, including multiple fields with earlier fields taking priority and ascending/descending direction per field.
- **Pagination:** Apply offset and limit on the backend and return the total matching count with the requested offset, limit, and page items.
- **Empty Results:** Return `200 OK` with `total: 0` and an empty `items` array when no exercises match.
- **Request Refreshes:** The client requests a new result set when filters, sorting, page size, or page index change. The client cancels obsolete in-flight requests; request cancellation is not an additional API operation.

## Non-Functional Requirements

- **Performance:** Return filtered and sorted results in under 500 ms for typical queries under normal traffic conditions.
- **Security:** API Gateway enforces HTTPS; the API app does not require HTTPS. Ensure users can only access their own exercises.
- **Reliability:** Return descriptive, safe error responses without leaking internal implementation details.
- **Scalability:** Support growth in exercise volume and concurrent user requests without degrading retrieval performance.
- **Input Validation:** Validate supported filter and sort values and pagination parameters; return 400 Bad Request for invalid values.

## Related Documents

- [Exercise List Screen](../../web/manage/exercise-list.md)
- [View My Exercises requirements](../../../requirements/manage/view-my-exercises.md)

## Changelog

| **Date**   | **Version** | **Changes**                                                                                                      |
| ---------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| 2026-10-05 | v1.2        | Changed supported sorting fields from name and status to name and creation date.                                 |
| 2026-10-04 | v1.1        | Aligned filters, sorting, pagination, and list response with the manage exercises feature and UI specifications. |
| 2026-08-29 | v1.0        | Initial release of the endpoint with filtering and sorting.                                                      |
