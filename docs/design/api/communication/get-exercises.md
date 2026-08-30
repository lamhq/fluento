# Get Exercises API

## Introduction

Retrieve a paginated, filterable, and sortable list of exercises owned by the current user for management purposes.

## Contract

- **Type:** REST
- **Signature:** `GET /v1/communication/exercises`
- **Versioning Strategy:** URL path versioning with `/v1/` prefix

### Request Headers

| **Name**   | **Value**          |
| ---------- | ------------------ |
| User-Email | `test@example.com` |
| Accept     | application/json   |

### Query Parameters

| **Name** | **Type** | **Required** | **Description**                                                                                                                                                                                                |
| -------- | -------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scenario | string   | No           | Case-insensitive partial match filter on scenario name.                                                                                                                                                        |
| topics   | string   | No           | Filter exercises by one or more topics (e.g., `?topics=Vocabulary&topics=Speaking`). Use OR condition                                                                                                          |
| status   | string   | No           | Filter by exercise status. Supported values: `active`, `archived`, `all`. Default: `all`.                                                                                                                      |
| sort     | string   | No           | Multi-column sort order using kebab-case field names. Use dash prefix (`-`) for descending order (e.g., `-created-at,scenario`). Default: `-created-at`. Supported fields: `scenario`, `created-at`, `status`. |
| offset   | integer  | No           | Number of items to skip for pagination. Default: `0`.                                                                                                                                                          |
| limit    | integer  | No           | Maximum number of items per response. Maximum 50. Default: `10`.                                                                                                                                               |

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
      "scenario": "Coffee Shop Order",
      "topics": ["Vocabulary", "Speaking"],
      "status": "active",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-01-20T14:15:00Z",
      "learnerRole": "customer",
      "counterpartRole": "barista"
    },
    {
      "id": "ex_457",
      "scenario": "Business Meeting",
      "topics": ["Grammar", "Communication"],
      "status": "active",
      "createdAt": "2026-01-10T09:00:00Z",
      "updatedAt": "2026-01-18T11:45:00Z",
      "learnerRole": "participant",
      "counterpartRole": "manager"
    }
  ]
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
  "details": "Database connection timeout"
}
```

## Functional Requirements

- **User Isolation:** Return only exercises owned by the user specified in the `User-Email` header.
- **Scenario Filtering:** Support case-insensitive partial match filter on the scenario field.
- **Topic Filtering:** Support filtering by one or more topics using OR condition. Accept multiple values via repeated query parameters (e.g., `?topics=Vocabulary&topics=Speaking`).
- **Status Filtering:** Support filtering by single status value or return all statuses.
- **Multi-Column Sorting:** Support sorting by `scenario`, `createdAt`, and `status` with multi-column sort capability using kebab-case field names and dash prefix for descending order.
- **Offset-Based Pagination:** Return results with offset, limit, total count, and array of items.
- **Limit Flexibility:** Support flexible limit (maximum 50).
- **Stale Request Cancellation:** Client should cancel prior in-flight requests when filters or pagination parameters change.
- **Empty Results:** Return empty items array when no exercises match the filter criteria.

## Non-Functional Requirements

- **Performance:** Return filtered and sorted results in under 500 ms for typical queries under normal traffic conditions.
- **Security:** All traffic must use HTTPS. Ensure users can only access their own exercises.
- **Reliability:** Gracefully handle server errors and return descriptive error responses without leaking internal implementation details.
- **Scalability:** Support growth in exercise volume and concurrent user requests without degrading retrieval performance.
- **Input Validation:** Validate all query parameters and return 400 Bad Request for invalid values.

## Changelog

| **Date**   | **Version** | **Changes**                                                 |
| ---------- | ----------- | ----------------------------------------------------------- |
| 2026-08-29 | v1.0        | Initial release of the endpoint with filtering and sorting. |
