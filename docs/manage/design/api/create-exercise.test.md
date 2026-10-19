# Create Exercise API Test Suite

## Introduction

This document defines prioritized tests for **Create Exercise API**.

- API contract: [Create Exercise API](./create-exercise.md)
- Data specification: [Core Data Specification](../../../core/spec/data.md).

Create a test user before running all tests.

Default request headers:

- `Content-Type: application/json`
- `Accept: application/json`
- `x-user-email: <test user email>`

## Create an exercise in each supported format (TC_API_CE_01)

### Description

Verify all exercises are created successfully with correct data when requests are valid.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare valid requests for all supported formats, with an expected `name` (inferred per [Exercise Name Mapping](../../../core/spec/data.md#exercise-name-mapping)).

### Test Steps

1. Submit request to `POST /v1/manage/exercises`.
2. Verify API response.
3. Retrieve the created exercise in the database.

### Expected Result

- Response status is `201 Created`.
- Response contains:
  - `id`: non-empty string
  - `name`: match with expected name
  - `createdAt`: timestamp string
  - `format`: string
  - `topics`: array of non-empty strings
  - `status`: string

### Postconditions

- One exercise per supported format is created for the authenticated user. The created exercise contains all common and format-specific fields (normalized).

## Reject unauthenticated create request (TC_API_CE_02)

### Description

Verify requests without authenticated user context cannot create exercises.

### Pre-conditions

- API is available.

### Test Data

- Prepare a complete valid request for any supported format.
- Omit `x-user-email` in request headers.

### Test Steps

1. Submit the body to `POST /v1/manage/exercises` without `x-user-email`.
2. Check the response.

### Expected Result

- The response status is `401 Unauthorized`.

### Postconditions

- No record is created in the database.

## Normalize field values (TC_API_CE_03)

### Description

Verify strings are trimmed, blank array items are removed before saving.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

Prepare requests for each supported format with:

- `topics`: array of blank strings and one string with whitespace around it.
- `references`: array of blank strings and one string with whitespace around it.
- `communication` format:
  - `scenario`: string with whitespace around it
  - `prompts`: array of blank strings and one string with whitespace around it
  - `validResponses`: array of blank strings and one string with whitespace around it
- `word` format:
  - `word`: string with whitespace around it
  - `meaning`: string with whitespace around it
  - `sentences`: array of blank strings and one string with whitespace around it
  - `clues`: array of blank strings and one string with whitespace around it
- `sentence` format:
  - `sentence`: string with whitespace around it
  - `scenario`: string with whitespace around it
  - `words`: array of blank strings and one string with whitespace around it
- `paragraph` format:
  - `paragraph`: string with whitespace around it
  - `scenario`: string with whitespace around it
  - `words`: array of blank strings and one string with whitespace around it

### Test Steps

1. Submit request to `POST /v1/manage/exercises`.
2. Verify API response.
3. Retrieve the created exercise in the database.

### Expected Result

- The response status is `201 Created`.
- The response contains `topics` as an array of trimmed strings.

### Postconditions

- Each field in the created exercise is normalized according to the rules: strings are trimmed, and arrays have blank entries removed.
- Empty arrays (after normalization) are not persisted.

## Reject missing required fields (TC_API_CE_04)

### Description

Verify requests with missing required fields are rejected.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- One request omits `format`, `status` fields
- One request with `format: "communication"`; omits `scenario`, `prompts`, and `validResponses` fields.
- One request with `format: "word"`; omits `word` and `meaning` fields.
- One request with `format: "sentence"`; omits `sentence` and `scenario` fields.
- One request with `format: "paragraph"`; omits `paragraph` and `scenario` fields.

### Test Steps

1. Submit request to `POST /v1/manage/exercises`.
2. Verify API response.

### Expected Result

- Every response status is `400 Bad Request`.
- Every response contains:
  - `code: "invalid_request_body"`
  - `message: "Request validation failed"`
  - `details` includes the omitted fields per request.

### Postconditions

- No exercise is created for any rejected request.

## Reject invalid field types (TC_API_CE_05)

### Description

Verify requests with invalid field types are rejected.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- One request with `format`, `topics`, `references`, `status` fields having invalid types.
- One request with `format: "communication"`; `scenario`, `prompts`, and `validResponses` fields having invalid types.
- One request with `format: "word"`; `word`, `meaning`, `sentences`, and `clues` fields having invalid types.
- One request with `format: "sentence"`; `sentence`, `scenario`, and `words` fields having invalid types.
- One request with `format: "paragraph"`; `paragraph`, `scenario`, and `words` fields having invalid types.

### Test Steps

1. Submit request to `POST /v1/manage/exercises`.
2. Verify API response.

### Expected Result

- Every response status is `400 Bad Request`.
- Every response contains:
  - `code: "invalid_request_body"`
  - `message: "Request validation failed"`
  - `details` includes the invalid fields per request.

### Postconditions

- No exercise is created for any rejected request.

## Reject invalid field values (TC_API_CE_06)

### Description

Verify requests with correctly typed but invalid field values are rejected.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- One request with `format`, `topics`, and `status` fields having invalid values.
- One request with `format: "communication"`; `scenario`, `prompts`, and `validResponses` fields having invalid values.
- One request with `format: "word"`; `word` and `meaning` fields having invalid values.
- One request with `format: "sentence"`; `sentence` and `scenario` fields having invalid values.
- One request with `format: "paragraph"`; `paragraph` and `scenario` fields having invalid values.

**Invalid values** include wrong enum values, empty required strings, and required arrays containing only blank or whitespace-only entries.

### Test Steps

1. Submit request to `POST /v1/manage/exercises`.
2. Verify API response.

### Expected Result

- Every response status is `400 Bad Request`.
- Every response contains:
  - `code: "invalid_request_body"`
  - `message: "Request validation failed"`
  - `details` includes the invalid fields per request.

### Postconditions

- No exercise is created for any rejected request.

## Reject inapplicable and unknown properties (TC_API_CE_07)

### Description

Verify requests containing inapplicable or unknown properties are rejected.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- A communication request with one field from another format and one unrecognized property.

### Test Steps

1. Submit request to `POST /v1/manage/exercises`.
2. Verify API response.

### Expected Result

- Response status is `400 Bad Request`.
- Response contains:
  - `code: "invalid_request_body"`
  - `message: "Request validation failed"`
  - `details` includes the disallowed fields.

### Postconditions

- No exercise is persisted for the rejected request.

## Do not persist omitted or empty optional fields (TC_API_CE_08)

### Description

Verify optional fields when omitted in the request, they are not stored in database with default value.

Verify optional fields whose value is submitted as an empty string/array inthe request, are not stored in the database.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare a complete communication request without `references`.
- Prepare a complete word request with empty `references`, `sentences`, and `clues` arrays.

### Test Steps

1. Submit each body to `POST /v1/manage/exercises`.
2. Verify each API response.
3. Retrieve each created exercise from the database.

### Expected Result

- Both responses have status `201 Created`.

### Postconditions

- Neither created exercise has the `references` field.
- The word exercise does not have the `sentences` or `clues` fields.
- Neither exercise has optional fields that were omitted or supplied as empty arrays.

## Hide internal details on service failure (TC_API_CE_09)

### Description

Verify error responses do not expose internal implementation details.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.
- The test can cause an internal error in the API.

### Test Data

- Prepare a request in any supported format.
- Configure `ExerciseService.create` to reject with an error containing a private implementation detail.

### Test Steps

1. Submit request to `POST /v1/manage/exercises`.
2. Restore the service spy.
3. Verify API response.

### Expected Result

- The response status is `500 Internal Server Error`.
- The response body contains:
  - `code: "internal_error"`
  - `message: "An unexpected error occurred. Please try again later."`.

### Postconditions

- No exercise is created for the failed request.
- The private implementation detail is absent from the response.
- The service spy is restored.

## Cleanup

- After each test, remove exercises of the test user from the database.
- After all tests, remove the test user from the database.
