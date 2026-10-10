# Create Exercise API Test Suite

## Introduction

This document defines prioritized tests for `POST /v1/manage/exercises`.

- API contract: [Create Exercise API](./create-exercise.md)
- Data specification: [Core Data Specification](../../../core/spec/data.md).

Default request headers:

- `Content-Type: application/json`
- `Accept: application/json`
- `x-user-email: <valid user email>`

## Create exercise for every format (TC_API_CE_01)

### Description

Verify each supported skill-format pair creates an exercise with the correct format-specific content.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare one complete request for each supported pair: communication/communication, vocabulary/word, articulation/sentence, and articulation/paragraph.
- Populate all required fields with valid values and include at least one topic.

### Test Steps

1. Submit each body in a separate request to `POST /v1/manage/exercises`.
2. Validate each response against the create-exercise summary schema.
3. Retrieve each record and compare its stored common and format-specific fields with the normalized request body.

### Expected Result

- Each request returns `201 Created`.
- Each response contains a generated, non-empty `id`, a valid `createdAt` timestamp, and the submitted `name`, `skill`, `format`, `topics`, and `status`.
- The response omits format-specific content and `references`.
- Each record contains the submitted fields and belongs to the authenticated user.

### Postconditions

- One exercise per supported pair is created for the test user.

## Reject unauthenticated create request (TC_API_CE_02)

### Description

Verify requests without authenticated user context cannot create exercises.

### Pre-conditions

- API is available.

### Test Data

- Prepare a complete valid request for any supported format and omit `x-user-email`.

### Test Steps

1. Submit the body to `POST /v1/manage/exercises` without `x-user-email`.
2. Search for a record with the request's unique test name.

### Expected Result

- The response status is `401 Unauthorized`.
- No matching exercise exists.

### Postconditions

- No exercise is created for the rejected request.

## Normalize field values (TC_API_CE_03)

### Description

Verify scalar values and array items are trimmed, and blank array entries are removed before storage.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare a communication request with whitespace around `name`, a scalar content field, and array items.
- Include blank-only entries alongside non-blank entries in `topics`, a required content array, and `references`.

### Test Steps

1. Submit the body to `POST /v1/manage/exercises`.
2. Check the response and retrieve the record.

### Expected Result

- The response status is `201 Created`.
- The response contains the trimmed `name` and `topics`.
- The stored `name`, scalar content, `topics`, format-specific arrays, and `references` are trimmed.
- Blank array entries are removed, and the remaining entries retain their order.

### Postconditions

- One normalized exercise is stored for the test user.

## Reject missing required fields (TC_API_CE_04)

### Description

Verify all required common and format-specific fields are required.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare one empty request to check missing common fields.
- Prepare one request for each supported exercise type with valid common fields and all format-specific fields omitted.

### Test Steps

1. Submit each request body to `POST /v1/manage/exercises`.
2. Check each response and confirm the test user's persisted exercise count is unchanged; some fixtures omit `name`.

### Expected Result

- Every response status is `400 Bad Request`.
- Every response contains `code: "invalid_request_body"` and `message: "Request validation failed"`.
- `details` includes each omitted required field.
- No exercise is created for any request.

### Postconditions

- No exercise is created for any rejected request.

## Reject invalid field types (TC_API_CE_05)

### Description

Verify common and format-specific fields accept only their declared types.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare one request with incorrect types for all common fields, including `references`.
- Prepare one request for each supported exercise type with incorrect types for all applicable format-specific fields.

### Test Steps

1. Submit each request body to `POST /v1/manage/exercises`.
2. Check each response and confirm the test user's persisted exercise count is unchanged; some fixtures contain an invalid `name`.

### Expected Result

- Every response status is `400 Bad Request`.
- Every response contains `code: "invalid_request_body"`, `message: "Request validation failed"`, and `details` entries for all fields whose types were changed.
- No exercise is created for any request.

### Postconditions

- No exercise is created for any rejected request.

## Reject invalid field values (TC_API_CE_06)

### Description

Verify correctly typed values are rejected when blank, empty after normalization, outside an enum, or incompatible with the selected skill.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare one request with correctly typed but invalid common values: blank `name`, unsupported `skill`, `format`, and `status`, and blank-only `topics`.
- Prepare one request for each supported exercise type with blank scalar values and empty or blank-only arrays in its format-specific fields.
- Prepare a correctly typed request with a communication skill and word format to check an incompatible pair.
- Prepare two complete communication requests with `references` set to an empty list and a list containing only blank or whitespace-only entries.

### Test Steps

1. Submit each request body to `POST /v1/manage/exercises`.
2. Check each response and confirm the test user's persisted exercise count is unchanged; some fixtures contain an invalid `name`.

### Expected Result

- Every response status is `400 Bad Request`.
- Every response contains `code: "invalid_request_body"`, `message: "Request validation failed"`, and `details` entries for all invalid fields; the incompatible-pair fixture includes a `format` entry, and requests with invalid `references` include a `references` entry.
- No exercise is created for any request.

### Postconditions

- No exercise is created for any rejected request.

## Reject inapplicable and unknown properties (TC_API_CE_07)

### Description

Verify the API rejects format-specific properties that do not apply and unrecognized body properties.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare a complete valid communication request with one field from another format and one unrecognized property.

### Test Steps

1. Submit the body to `POST /v1/manage/exercises`.
2. Check the response and search for a record with the request's unique name.

### Expected Result

- The response status is `400 Bad Request`.
- The body contains `code: "invalid_request_body"`, `message: "Request validation failed"`, and a `details` entry for each disallowed property.
- No exercise is created.

### Postconditions

- No exercise is persisted for the rejected request.

## Do not persist omitted optional fields (TC_API_CE_08)

### Description

Verify optional `references` can be omitted and remains absent from stored exercises.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.

### Test Data

- Prepare a complete communication request without `references`.

### Test Steps

1. Submit the body to `POST /v1/manage/exercises`.
2. Retrieve the created record and check that each omitted field is absent.

### Expected Result

- The response status is `201 Created`.
- Each created record omits its request's `references` field.

### Postconditions

- One exercise per request is stored without its omitted optional fields.

## Hide internal details on service failure (TC_API_CE_09)

### Description

Verify exercise-service failures return a generic server error without exposing internal details.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.
- The test can make `ExerciseService.create` reject with an error.

### Test Data

- Prepare a complete communication request with a unique test name.
- Configure `ExerciseService.create` to reject with an error containing a private implementation detail.

### Test Steps

1. Submit the body to `POST /v1/manage/exercises`.
2. Check the response and search for a record with the request's name.
3. Restore the service spy even if an assertion fails.

### Expected Result

- The response status is `500 Internal Server Error`.
- The response body contains only the generic error code `INTERNAL_SERVER_ERROR` and message `Unable to create exercise`.

### Postconditions

- No exercise is created for the failed request.
- The private implementation detail is absent from the response.
- The service spy is restored.

## Cleanup

- After each test, delete exercises whose names contain that run's unique cleanup marker.
- Ensure service spies or other injected failure behavior are restored in a `finally` block.
