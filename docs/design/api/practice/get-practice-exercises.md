# Get Practice Exercises API

## Introduction

Retrieve a paginated list of exercises available to a learner for practice, with support for filtering by topics and sorting.

## Contract

- **Type:** REST
- **Signature:** `GET /v1/practice/exercises`
- **Versioning Strategy:** URL path versioning with `/v1/` prefix

### Request Headers

| **Name**     | **Value**          |
| ------------ | ------------------ |
| x-user-email | `test@example.com` |
| Accept       | application/json   |

### Query Parameters

| **Name** | **Type** | **Required** | **Description**                                                                                                                                                                                                            |
| -------- | -------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| topics   | string   | No           | Filter exercises by one or more topics (e.g., `?topics=Restaurant&topics=School`). Use OR condition.                                                                                                                       |
| sort     | string   | No           | Multi-column sort order using camelCase field names. Use dash prefix (`-`) for descending order (e.g., `-practicedAt,createdAt`). Default: `-practicedAt`. Supported fields: `practicedAt`, `lastPracticeAt`, `createdAt`. |
| after    | string   | No           | Cursor exercise ID returned by the previous page. Omit for the first page.                                                                                                                                                 |
| limit    | integer  | No           | Maximum number of items per response. Capped at 50 by the repository. Default: `10`.                                                                                                                                       |

### Response

**Success (200 OK):**

```json
{
  "items": [
    {
      "id": "65f000000000000000000001",
      "name": "Answer small talk questions",
      "skill": "communication",
      "format": "communication",
      "topics": ["Common"],
      "scenario": "Answer small talk questions",
      "prompts": ["What are you up to this weekend?"],
      "references": [
        "https://www.youtube.com/post/UgkxxlFNH4jWYGJjnF80H7-9OdHlbtvRpBtS"
      ],
      "practicedAt": "2026-08-10T09:00:00Z",
      "practiceCount": 3
    },
    {
      "id": "65f000000000000000000006",
      "name": "customs",
      "skill": "vocabulary",
      "format": "word",
      "topics": ["Airport", "Travel"],
      "word": "customs",
      "meaning": "The official procedures and formalities required by a country when entering or leaving it.",
      "sentences": [
        "At customs, they're going to ask for your passport and stamp it."
      ],
      "clues": ["passport", "inspection", "border", "declaration", "immigration"],
      "references": [],
      "practicedAt": null,
      "practiceCount": 0
    },
    {
      "id": "65f00000000000000000000b",
      "name": "Talk about your background",
      "skill": "articulation",
      "format": "sentence",
      "topics": ["Job Interview", "Software Engineering"],
      "scenario": "Talk about your background",
      "prompts": ["Describe your educational background using provided words."],
      "words": ["study", "computer science", "university", "bachelor's degree"],
      "references": [],
      "practicedAt": null,
      "practiceCount": 0
    },
    {
      "id": "65f00000000000000000000e",
      "name": "Mid-Autumn Festival Introduction",
      "skill": "articulation",
      "format": "paragraph",
      "topics": ["Mid-Autumn Festival"],
      "scenario": "Mid-Autumn Festival Introduction",
      "prompts": [
        "Read and practice the following paragraph about the Mid-Autumn Festival."
      ],
      "paragraph": "The Mid-Autumn Festival is one of the most important traditional celebrations in Vietnam. It is usually held on the 15th day of the eighth lunar month when the moon is at its fullest and brightest. This festival is especially meaningful for children, who eagerly wait for the occasion each year. Families often gather together to enjoy mooncakes, fruits, and tea while admiring the beautiful moon. Children carry colorful lanterns and participate in joyful lantern parades around their neighborhoods. Lion dances are also a popular activity that brings excitement and good luck during the festival. Many people believe that the full moon symbolizes unity, happiness, and family reunion. Traditional folk stories, such as the tale of Cuội and the Moon Lady, are often shared with children. Schools and communities frequently organize cultural performances and games to celebrate the event. Overall, the Mid-Autumn Festival is a cherished Vietnamese tradition that strengthens family bonds and preserves cultural values.",
      "words": [
        "Mid-Autumn Festival",
        "15th day",
        "mooncakes",
        "lanterns",
        "lion dances",
        "full moon",
        "family reunion"
      ],
      "references": [],
      "practicedAt": "2026-08-10T09:00:00Z",
      "practiceCount": 3
    }
  ],
  "nextCursor": null,
  "previousCursor": null,
  "hasNext": false,
  "hasPrevious": false
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

- **User Identification:** Require the `x-user-email` header to identify the learner making the request.
- **Exercise Retrieval:** Return only active exercises.
- **Paging Support:** Support `limit` and `after` to paginate results without returning the full exercise set at once. Return flat `nextCursor`, `previousCursor`, `hasNext`, and `hasPrevious` fields.
- **Sorting Support:** Support ordering exercises by:
  - `practicedAt`: the time the current learner practiced them
  - `createdAt`: the time they were added
- **Topic Filtering:** Allow filtering by one or more topic values when the client needs a narrower set of scenarios. Topics use an OR condition.

## Non-Functional Requirements

- **Performance:** The endpoint should return standard exercise lists in under 500 ms under normal traffic and keep pagination efficient for large datasets.
- **Security:** All traffic must use HTTPS.
- **Reliability:** The service should gracefully handle server errors and return a clear 500 error response without leaking internal implementation details.
- **Scalability:** The endpoint must support growth in exercise volume and concurrent learner requests without degrading list retrieval performance.

## Changelog

| **Date**   | **Version** | **Changes**                                                                                                                    |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-13 | v1.0        | Initial release of the endpoint.                                                                                               |
| 2026-08-13 | v1.1        | Added sorting support, including `practicedAt`, and pagination parameters `limit` and `offset`.                                |
| 2026-08-28 | v1.2        | Restricted learner-facing practice responses to active exercises only; archived exercises are filtered out from this endpoint. |
| 2026-08-31 | v1.3        | Migrated pagination to the cursor-based contract using `cursor` and `pagination` metadata.                                     |
