# Practice Exercise Screen

## Introduction

- **Purpose**: Help a learner complete an exercise and receive actionable feedback on the skills evaluated by that exercise.
- **Context**: This screen is the main practice flow where learners review an exercise, provide a response in the required format, and review feedback.
- **Key goals**:
  - Display the exercise prompt, context, and response requirements.
  - Let the learner submit a response using the exercise's supported input.
  - Show a feedback summary with exercise-appropriate corrections, explanations, or examples.
  - Allow the learner to retry or move to the next exercise without repetition.

## Wireframes & Mockups

```text
+---------------------------------------------------------------+
| Exercise title                                                |
|---------------------------------------------------------------|
| Exercise context, instructions, prompt                        |
|                                                               |
| Response:                                                     |
| [ input appropriate to the exercise ]                         |
|---------------------------------------------------------------|
|                     [ Submit ]  [ Next ]                      |
+---------------------------------------------------------------+
```

After submission:

```text
+----------------------------------------------------------------+
| Excellent work!                                            95% |
|----------------------------------------------------------------|
| Your response met the exercise requirements.                   |
|                                                                |
| Suggested correction, if available:                            |
| "Example of an improved response."                             |
|                                                                |
| What to improve:                                               |
| - Review the feedback for the evaluated skill.                 |
|                                                                |
| Example responses, if available:                               |
| - "Example response appropriate to this exercise."             |
+----------------------------------------------------------------+
```

## Displayed Information

- **Exercise**: Follow the [Exercise Display](../../../requirements/practice/view-practice-exercise.md#exercise-display) requirement.
  - Title: Practice type title or the communication exercise's scenario.
  - Topic: Exercise topic displayed below the title in parentheses.
  - Prompt: Exercise prompt, response requirements, etc.
  - Content: word clues, word meaning, etc.
- **Response input**:
  - Input control appropriate to the practice type.
  - Label and instructions describing the expected response.
- **Action buttons**:
  - Submit response.
  - Retry response (shown after submission).
  - Move to next exercise (shown after submission).
- **Feedback panel** (after submission):
  - A feedback icon and status message appear together in the header.
  - The numeric score sits on the far right of the header.
  - Corrected response, if available.
  - Specific improvements for the evaluated skill.
  - Suggested examples or alternative responses, if available.
  - Links to related lectures or resources, if available.

## User Interactions

- **Submit response**:
  - When the learner taps or clicks Submit, the app validates that the response is not empty.
  - The app sends the response to the response submission API with the exercise ID and response format.
  - The feedback returned by the backend is rendered in the feedback panel.
- **Retry**:
  - When the learner clicks Retry, the response input is cleared and the feedback panel is reset.
  - The same exercise remains available for reattempting.
- **Next exercise**:
  - When the learner clicks Next, the app fetches another active exercise and selects a practice type allowed by its format.
  - Prevent duplicate requests while an exercise is loading.

## Practice Type Determination

- After fetching an exercise, the app randomly chooses the appropriate practice type based on the exercise format. See [Choosing Practice Types](../../../requirements/practice/view-practice-exercise.md#choosing-practice-types).

## Error Handling

- **User errors**:
  - Empty response: show "Please enter a response before submitting."
  - Invalid response for the exercise: show a brief validation prompt and allow the learner to revise.
- **System errors**:
  - Exercise fetch fails: show "We couldn't load the exercise. Please try again."
  - No results: show an empty state with Retry and Leave options.
  - Unsupported or incomplete data: show an unavailable-exercise message and allow the learner to request another exercise.
  - Submission fails due to network or backend issues: show "Your response could not be submitted. Please retry."
  - Feedback generation fails: show "We couldn't evaluate your response right now. Please try again later."

## Validation Rules

- **Response input**:
  - The response must not be empty after trimming whitespace.
  - The response must match the input and validation requirements of the practice type.
  - Length, format, and required fields are defined by the practice type.

## Dependencies & Integration

- **Get exercises API**:
  - return an active exercise with its practice format, content, and response requirements.
- **Submit response API**:
  - accept a response for evaluation.
  - Evaluate the learner's response and return an overall score, feedback, and exercise-specific corrections or suggestions.

## Authentication & Authorization

- Learners must be authenticated before accessing the screen.

## Accessibility Requirements

- The exercise prompt, response field, and feedback sections must be accessible to screen readers.
- Every input and action button should have a visible label and accessible name.
- The response field should support keyboard navigation and text input without requiring a mouse.
- Color contrast should meet WCAG 2.1 AA for text, buttons, and feedback states.
- Feedback emojis should not be the only indicator of score meaning; the textual score and message must remain visible.

## Feedback Score Icons

- The feedback summary should show a score icon alongside the numeric score and status text.
- A simple emoji scale can be used to visually reinforce the score band without replacing the numeric result:
  - `🌟` for 90–100
  - `😊` for 70–89
  - `😐` for 40–69
  - `😕` for 0–39
- The emoji is decorative only; the text label and score value must remain visible to users and screen readers.

## Performance Requirements

- Feedback response should appear promptly after submission without blocking the rest of the app.
- Exercise retrieval and submission should handle network latency gracefully with loading states and retry affordances.

## Security Considerations

- User responses should be sanitized and handled as untrusted input before rendering in the UI.
- Feedback content should be rendered safely to prevent XSS or unsafe HTML injection.
