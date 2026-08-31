# Submit Response API

## Introduction

Submit a learner's written response in an exercise for evaluation and return actionable feedback.

## Contract

- **Type:** REST
- **Signature:** `POST /v1/practice/exercises/<exerciseId>/responses`
- **Versioning Strategy:** URI versioning using `/v1`

### Request Headers

| **Name**     | **Value**          |
| ------------ | ------------------ |
| User-Email   | `test@example.com` |
| Content-Type | application/json   |
| Accept       | application/json   |

### Path Parameters

| **Name**   | **Type** | **Required** | **Description**                                   |
| ---------- | -------- | ------------ | ------------------------------------------------- |
| exerciseId | string   | Yes          | Unique identifier of the exercise being answered. |

### Request Body

```json
{
  "response": "I'd be happy to meet tomorrow to discuss the project."
}
```

| **Name** | **Type** | **Required** | **Description**                                                                            |
| -------- | -------- | ------------ | ------------------------------------------------------------------------------------------ |
| response | string   | Yes          | The learner's plain-text answer to the exercise prompt. Must be trimmed before validation. |

### Response

**Success (201 Created):**

```json
{
  "id": "resp_456",
  "exerciseId": "ex_123",
  "response": "Lets meet tomorrow to discuss the project.",
  "feedback": "Excellent work. Your response is clear, polite, and appropriate for the scenario.",
  "score": 95,
  "correctness": {
    "score": 95,
    "feedback": "Your response is grammatically correct, with one minor contraction improvement.",
    "fixes": ["Use the contraction form: 'Let's' instead of 'Lets'."],
    "correctedSentence": "Let's meet tomorrow to discuss the project."
  },
  "appropriateness": {
    "score": 95,
    "feedback": "The response is relevant to the prompt and matches the tone expected in the scenario.",
    "clarity": {
      "score": 96,
      "feedback": "The message is easy to understand and free of ambiguity."
    },
    "politeness": {
      "score": 97,
      "feedback": "The response shows courtesy and respects the other person."
    },
    "tone": {
      "score": 94,
      "feedback": "The tone is friendly and appropriate for a conversation in this context."
    }
  }
}
```

**Error (400 Bad Request):**

```json
{
  "code": "INVALID_REQUEST",
  "message": "Response is required and must not be empty."
}
```

**Error (404 Not Found):**

```json
{
  "code": "RESOURCE_NOT_FOUND",
  "message": "The requested resource does not exist or is no longer available."
}
```

**Error (502 Bad Gateway):**

```json
{
  "code": "3RD_PARTY_API_ERROR",
  "message": "The evaluation service is temporarily unavailable. Please try again later."
}
```

**Error (500 Internal Server Error):**

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Unable to handle your request at this time. Please try again later."
}
```

## Functional Requirements

- **User Identification:** Use the `User-Email` header to identify which learner is submitting the response.
- **Validation:** Reject empty or whitespace-only submissions before evaluation.
- **Context Matching:** Evaluate the response to the exercise scenario, learner role, and counterpart role.
- **AI-Based Evaluation:** Use AI service for scoring, return overall feedback and corrected sentences or fix suggestions.
- **Suggestions:** Return polished alternatives aligned with the exercise context.
- **Retry Support:** Allow repeated submissions for the same exercise. Each attempt is tracked separately and counts toward practice.

## Non-Functional Requirements

- **Performance:** Complete evaluations within 3 seconds under normal traffic, including validation and feedback generation.
- **Security:** All traffic must use HTTPS.
- **Scalability:** Support concurrent learners without slower standard response times.

## Changelog

| Date       | Version | Changes                                                 |
| ---------- | ------- | ------------------------------------------------------- |
| 2026-08-13 | v1.0    | Initial release of the communication response endpoint. |
