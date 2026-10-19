# Update Exercise API Test Suite

This document specifies the update validation and optional-field test cases.

- Data specification: [Core Data Specification](../../../core/spec/data.md).

Create a test user and an existing exercise owned by that user before running each test.

Default request headers:

- `Content-Type: application/json`
- `Accept: application/json`
- `x-user-email: <test user email>`

## Reject invalid field values (TC_API_UE_06)

### Description

Verify correctly typed requests with invalid required values are rejected and do not modify the existing exercise. Empty or whitespace-only optional `references` values are not invalid values; their non-persistence is covered by TC_API_UE_08.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.
- An existing exercise is stored for the authenticated user, and its original state is recorded.

### Test Data

Prepare requests containing one of the following invalid values:

- An unsupported `format`, blank `topics`, and an unsupported `status`.
- For `communication`: a blank `scenario`, prompts containing only blank values, or an empty `validResponses` array.
- For `word`: blank `word` and `meaning`.
- For `sentence`: blank `sentence` and `scenario`.
- For `paragraph`: blank `paragraph` and `scenario`.

### Test Steps

1. Submit each request to `PUT /v1/manage/exercises/{id}`.
2. Verify the response.
3. Retrieve the existing exercise from the database.

### Expected Result

- Every response has status `400 Bad Request`.
- Every response contains:
  - `code: "invalid_request_body"`
  - `message: "Request validation failed"`
  - `details` containing the invalid fields for that request.

### Postconditions

- The existing exercise is unchanged for every rejected request.

## Do not persist optional fields when omitted or empty (TC_API_UE_08)

### Description

Verify optional fields when omitted in the request, they are not stored in database with default value.

Verify optional fields whose value is submitted as an empty string/array inthe request, are not stored in the database.

### Pre-conditions

- API is available, and the test harness provides an authenticated user.
- An existing exercise is stored for the authenticated user.

### Test Data

- A complete communication request without `references`.
- Complete communication requests with `references: []` and `references: [" ", "\t"]`.

### Test Steps

1. Submit each request to `PUT /v1/manage/exercises/{id}`.
2. Verify each response.
3. Retrieve the updated exercise from the database.

### Expected Result

- Every response has status `200 OK`.

### Postconditions

- The updated exercise does not have a `references` field when it was omitted, empty, or contained only whitespace values.
