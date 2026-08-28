# Get Practice Exercises API

## Introduction

Retrieve a list of practice exercises available to a learner.

## Contract

- **Type:** REST
- **Signatures:** `GET /practice/exercises`
- **Authentication:** OAuth 2.0 with Bearer token
- **Versioning Strategy:** No explicit version prefix in the current route definition

### Request Headers

| **Name**      | **Value**        |
| ------------- | ---------------- |
| Authorization | Bearer `<token>` |
| Accept        | application/json |
| x-user-email  | test@example.com |

### Query Parameters

| **Name** | **Type** | **Required** | **Description**                                                                                            |
| -------- | -------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| sort     | string   | No           | Sort order for the result set. Supported values: `lastPracticeAt`, `createdAt`. Default: `lastPracticeAt`. |
| limit    | integer  | No           | Maximum number of exercises to return. Default: `20`.                                                      |
| offset   | integer  | No           | Number of exercises to skip for pagination. Default: `0`.                                                  |
| topics   | string[] | No           | Optional filter by exercise topics, such as `Restaurant`, `School`, or `Socializing`.                      |

### Response

> `status` is internal and omitted from practice responses.

**Success (200 OK):**

```json
[
  {
    "id": "ex_123",
    "lastPracticeAt": "2026-08-13T09:30:00Z",
    "topics": ["Restaurant"],
    "scenario": "ordering food in a restaurant",
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
    ],
    "createdAt": "2026-08-13T10:00:00Z",
    "updatedAt": "2026-08-13T10:00:00Z"
  }
]
```

**Error (401 Unauthorized):**

```json
{
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

**Error (500 Internal Server Error):**

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Unable to retrieve exercises"
}
```

## Functional Requirements

- **Exercise Retrieval:** Return a list of communication exercises that are available to the authenticated learner.
- **Paging Support:** Support `limit` and `offset` to paginate results without returning the full exercise set at once.
- **Sorting Support:** Support ordering exercises by:
  - `lastPracticeAt`: the time the current learner practiced them
  - `createdAt`: the time they were added
- **Topic Filtering:** Allow filtering by one or more topic values when the client needs a narrower set of scenarios.
- **Authentication Enforcement:** Only authenticated learners can access the exercise list.

## Non-Functional Requirements

- **Performance:** The endpoint should return standard exercise lists in under 500 ms under normal traffic and keep pagination efficient for large datasets.
- **Security:** All traffic must use HTTPS, and the API must validate JWT authentication for each request before returning any data.
- **Reliability:** The service should gracefully handle server errors and return a clear 500 error response without leaking internal implementation details.
- **Scalability:** The endpoint must support growth in exercise volume and concurrent learner requests without degrading list retrieval performance.

## Changelog

| **Date**   | **Version** | **Changes**                                                                                        |
| ---------- | ----------- | -------------------------------------------------------------------------------------------------- |
| 2026-08-13 | v1.0        | Initial release of the endpoint for communication practice scenarios.                              |
| 2026-08-13 | v1.1        | Added sorting support, including `lastPracticeAt`, and pagination parameters `limit` and `offset`. |
