# Submit Exercise Response API

## Introduction

Submit a learner's response, evaluate it according to the requested practice type, store the attempt, update progress, and return feedback.

## Contract

- **Type:** REST
- **Signature:** `POST /v1/practice/exercises/{exerciseId}/responses`
- **Versioning:** URI versioning with `/v1`

### Request

Headers:

| Name           | Value              |
| -------------- | ------------------ |
| `x-user-email` | `test@example.com` |
| `Content-Type` | `application/json` |
| `Accept`       | `application/json` |

Path parameter: `exerciseId` (string, required), the active exercise being answered.

Body:

```json
{
  "practiceType": "communication",
  "response": "I'd be happy to meet tomorrow to discuss the project."
}
```

| Name           | Type   | Required | Description                                                                                                                                                               |
| -------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `practiceType` | string | Yes      | Evaluation discriminator. Value must be compatible with exercise's format follow the [practice data specification](../../../requirements/practice/data.md#practice-type). |
| `response`     | string | Yes      | Learner's answer. The server trims it and rejects empty or whitespace-only values.                                                                                        |

The client supplies `practiceType` because one exercise `format` can support multiple practice types. The server validates that it is compatible with the exercise.

### Success Response

**201 Created**

```json
{
  "id": "resp_456",
  "exerciseId": "ex_123",
  "practiceType": "communication",
  "response": "Let's meet tomorrow to discuss the project.",
  "score": 95,
  "feedback": "Your response is clear, polite, and appropriate.",
  "correctness": {
    "score": 100,
    "feedback": "The response is grammatically correct.",
    "fixes": [],
    "correctedSentence": ""
  },
  "appropriateness": {
    "score": 95,
    "feedback": "The response is relevant and matches the expected tone.",
    "clarity": { "score": 96, "feedback": "The message is easy to understand." },
    "politeness": { "score": 97, "feedback": "The response is courteous." },
    "tone": { "score": 94, "feedback": "The tone fits the conversation." }
  }
}
```

Every success response contains `id`, `exerciseId`, `practiceType`, `response`, `score`, and `feedback`. `correctness` and `appropriateness` are included when supported by the practice type.

### Feedback Contract

Practice-type-specific feedback fields and their nested schemas are defined in the [practice data specification](../../../requirements/practice/data.md#feedback-availability) and the `practice_attempts` schema in [Database Design](../../data.md#practice_attempts-collection).

### Errors

| Status | Code                    | Meaning                                                  |
| ------ | ----------------------- | -------------------------------------------------------- |
| 400    | `INVALID_REQUEST`       | Missing, empty, or unsupported request data.             |
| 404    | `RESOURCE_NOT_FOUND`    | Exercise does not exist, is inactive, or is unavailable. |
| 502    | `THIRD_PARTY_ERROR`     | Evaluation provider is temporarily unavailable.          |
| 500    | `INTERNAL_SERVER_ERROR` | Unexpected server failure.                               |

Error responses contain a stable `code` and user-safe `message`.

## Functional Requirements

- Require `x-user-email` to identify the learner.
- Resolve an active `exerciseId` and validate `practiceType` against its `format`.
- Trim and reject empty or whitespace-only responses before evaluation.
- Use AI for Communication, Using Word, Sentence Construction, Sentence Variation, and Paragraph Variation.
- Use exact matching for Just One Word and Word Guessing.
- Store every submission as a separate attempt with its feedback.
- Update the learner's `practicedAt` and increment `practiceCount` after evaluation.
- Allow repeated submissions for the same exercise; each attempt returns its own identifier and feedback.

## Non-Functional Requirements

- Complete exact matches immediately and AI evaluations within 3 seconds under normal traffic.
- Require authenticated learner identity. HTTPS is enforced by API Gateway; the API service does not require HTTPS.
- Avoid exposing evaluation-provider or implementation details in errors.
- Support concurrent learners without degrading standard response times.

## Changelog

| Date       | Version | Changes                                                |
| ---------- | ------- | ------------------------------------------------------ |
| 2026-08-13 | v1.0    | Initial communication response endpoint design.        |
| 2026-09-30 | v1.1    | Expanded the contract to all supported practice types. |
