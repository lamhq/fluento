# Get Practice Exercises API

## Introduction

Retrieve a paginated list of exercises available to a learner for practice, with support for filtering by topics and sorting.

## Contract

- **Type:** REST
- **Signature:** `GET /v1/practice/exercises`
- **Versioning Strategy:** URL path versioning with `/v1/` prefix

### Request Headers

| **Name**   | **Value**          |
| ---------- | ------------------ |
| User-Email | `test@example.com` |
| Accept     | application/json   |

### Query Parameters

| **Name** | **Type** | **Required** | **Description**                                                                                                                                                                                          |
| -------- | -------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| topics   | string   | No           | Filter exercises by one or more topics (e.g., `?topics=Restaurant&topics=School`). Use OR condition.                                                                                                     |
| sort     | string   | No           | Multi-column sort order using camelCase field names. Use dash prefix (`-`) for descending order (e.g., `-practicedAt,createdAt`). Default: `-practicedAt`. Supported fields: `practicedAt`, `createdAt`. |
| cursor   | string   | No           | Opaque cursor token returned by the previous page. Omit for the first page.                                                                                                                              |
| limit    | integer  | No           | Maximum number of items per response. Maximum 50. Default: `10`.                                                                                                                                         |

### Response

**Success (200 OK):**

```json
{
  "items": [
    {
      "id": "ex_123",
      "scenario": "Ordering Food in a Restaurant",
      "topics": ["Restaurant", "Vocabulary"],
      "createdAt": "2026-08-13T10:00:00Z",
      "updatedAt": "2026-08-13T10:00:00Z",
      "practicedAt": "2026-08-13T09:30:00Z",
      "practiceCount": 5,
      "learnerRole": "customer",
      "counterpartRole": "waiter",
      "prompts": ["Say that you would like to order a meal."],
      "expectedResponses": [
        {
          "content": "I would like to order the grilled salmon, please.",
          "style": ["polite", "simple"]
        },
        {
          "content": "Could I have the chicken curry with rice?",
          "style": ["polite", "clear"]
        }
      ]
    },
    {
      "id": "ex_124",
      "scenario": "Greeting a Friend",
      "topics": ["Socializing", "Speaking"],
      "createdAt": "2026-08-10T14:00:00Z",
      "updatedAt": "2026-08-12T16:30:00Z",
      "practicedAt": "2026-08-12T15:45:00Z",
      "learnerRole": "friend",
      "counterpartRole": "friend",
      "prompts": ["Greet your friend warmly."],
      "expectedResponses": [
        {
          "content": "Hi! How have you been?",
          "style": ["friendly", "casual"]
        }
      ]
    }
  ],
  "pagination": {
    "nextCursor": "ex_124",
    "previousCursor": null,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

**Error (400 Bad Request):**

```json
{
  "code": "INVALID_LIMIT",
  "message": "Invalid limit value. Maximum allowed is 50.",
  "details": "Received: 100"
}
```

**Error (500 Internal Server Error):**

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Unable to retrieve exercises",
  "details": "An unexpected error occurred while fetching practice exercises."
}
```

## Functional Requirements

- **User Identification:** Use the `User-Email` header to identify the learner making the request.
- **Exercise Retrieval:** Return only active exercises.
- **Paging Support:** Support `limit` and `cursor` to paginate results without returning the full exercise set at once.
- **Sorting Support:** Support ordering exercises by:
  - `practicedAt`: the time the current learner practiced them
  - `createdAt`: the time they were added
- **Topic Filtering:** Allow filtering by one or more topic values when the client needs a narrower set of scenarios.

## Non-Functional Requirements

- **Performance:** The endpoint should return standard exercise lists in under 500 ms under normal traffic and keep pagination efficient for large datasets.
- **Security:** All traffic must use HTTPS.
- **Reliability:** The service should gracefully handle server errors and return a clear 500 error response without leaking internal implementation details.
- **Scalability:** The endpoint must support growth in exercise volume and concurrent learner requests without degrading list retrieval performance.

## Changelog

| **Date**   | **Version** | **Changes**                                                                                                                    |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-13 | v1.0        | Initial release of the endpoint for communication practice scenarios.                                                          |
| 2026-08-13 | v1.1        | Added sorting support, including `practicedAt`, and pagination parameters `limit` and `offset`.                                |
| 2026-08-28 | v1.2        | Restricted learner-facing practice responses to active exercises only; archived exercises are filtered out from this endpoint. |
| 2026-08-31 | v1.3        | Migrated pagination to the cursor-based contract using `cursor` and `pagination` metadata.                                     |
