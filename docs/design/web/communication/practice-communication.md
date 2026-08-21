# Practice Communication Screen

## Introduction

- **Purpose**: Help a learner practice responding to a scenario-based communication prompt and receive actionable feedback on clarity, tone, and correctness.
- **Context**: This screen is the main practice flow where learners read a prompt, write a response, and review feedback.
- **Key goals**:
  - Display a realistic communication scenario and prompt.
  - Let the learner submit a response for evaluation.
  - Show a feedback summary with corrections and example alternatives.
  - Allow the learner to retry or move to the next exercise without repetition.

## Wireframes & Mockups

```text
+---------------------------------------------------------------+
| Practice Communication                                        |
|---------------------------------------------------------------|
| You're a customer ordering food in a restaurant               |
|                                                               |
| Waiter said:                                                  |
| "What would you like to order?"                               |
|                                                               |
| Response in a polite manner:                                  |
| [ textarea for learner response ]                             |
|                                                               |
| [ Submit ]  [ Retry ]  [ Next ]                               |
+---------------------------------------------------------------+

After submission:

+------------------------------------------------------------------+
| 🌟 95/100. Excellent work! Your response was clear and polished. |
|                                                                  |
| Corrected Sentence:                                              |
| "Let's meet tomorrow to discuss the project."                    |
|                                                                  |
| Fixes:                                                           |
| - "Lets" → "Let's"                                               |
|                                                                  |
| You can also say:                                                |
| - "I'd be happy to meet tomorrow to talk about the project."     |
| - "Tomorrow works well for me. Let's discuss the details then."  |
| - "Sure, let's meet tomorrow to go over the project."            |
+------------------------------------------------------------------+
```

## Displayed Information

- **Exercise metadata**:
  - Learner role (e.g., customer, employee, student).
  - Scenario context (e.g., ordering food, asking for a meeting, making a complaint).
  - Counterpart role (e.g., waiter, manager, teammate).
  - Exercise prompt text.
- **Response input**:
  - Label describing the required tone or style.
  - Multi-line text area for the learner's answer.
- **Action buttons**:
  - Submit response.
  - Retry response (shown after submission).
  - Move to next exercise (shown after submission).
- **Feedback panel** (after submission):
  - Score value and status message.
  - Corrected sentence, if available.
  - Specific grammar or phrasing improvements.
  - Suggested alternative responses.
- **Data source**:
  - Exercise content and evaluation results are loaded from the communication exercise API.

## User Interactions

- **Submit response**:
  - When the learner taps or clicks Submit, the app validates that the response is not empty.
  - The app sends the response to the response submission API.
  - The feedback returned by the backend is rendered in the feedback panel.
- **Retry**:
  - When the learner clicks Retry, the response input is cleared and the feedback panel is reset.
  - The same exercise remains available for reattempting.
- **Next exercise**:
  - When the learner clicks Next, the app fetches and selects the next exercise.

## Exercise selection logic

- See the [Feature Specification Document](../../../requirements/communication/practice-communication.md#exercise-selection-logic).

## Error Handling

- **User errors**:
  - Empty response: show "Please enter a response before submitting."
  - Irrelevant response: show a brief validation prompt and allow the learner to revise.
- **System errors**:
  - Exercise fetch fails: show "We couldn't load the exercise. Please try again."
  - Submission fails due to network or backend issues: show "Your response could not be submitted. Please retry."
  - Feedback generation fails: show "We couldn't evaluate your response right now. Please try again later."

## Validation Rules

- **Response input**:
  - The response must not be empty after trimming whitespace.
  - The response should be submitted as plain text.
  - Maximum length is 150 characters.

## Dependencies & Integration

- **Get exercises API**:
  - return a list of exercises.
  - allow specifying sort order, including last practice order.
  - allow specifying a limit and offset for pagination.
- **Submit response API**:
  - accept a response for evaluation.
  - Evaluate the learner's response and return score, corrections, and suggestions.

## Authentication & Authorization

- Learners must be authenticated before accessing the screen.

## Accessibility Requirements

- The exercise prompt, response field, and feedback sections must be accessible to screen readers.
- Every input and action button should have a visible label and accessible name.
- The response field should support keyboard navigation and text input without requiring a mouse.
- Color contrast should meet WCAG 2.1 AA for text, buttons, and feedback states.
- Feedback emojis should not be the only indicator of score meaning; the textual score and message must remain visible.

## Responsiveness

- **Mobile**:
  - The prompt and text area stack vertically with sufficient spacing for touch input.
  - Buttons are larger and remain reachable without horizontal scrolling.
- **Tablet**:
  - Content width remains readable with moderate padding and a centered layout.
- **Desktop**:
  - The screen uses a comfortable reading width and maintains the full response area with clear separation between prompt and feedback.

## Performance Requirements

- The app should avoid unnecessary re-fetches by caching exercises for 3 minutes.
- Feedback response should appear promptly after submission without blocking the rest of the app.
- Exercise retrieval and submission should handle network latency gracefully with loading states and retry affordances.

## Security Considerations

- User responses should be sanitized and handled as untrusted input before rendering in the UI.
- Feedback content should be rendered safely to prevent XSS or unsafe HTML injection.
- API calls must use secure transport and authentic user sessions.
- The app should not expose sensitive user data in analytics or logs.

## Analytics & Tracking

- Track screen view when the practice communication screen loads.
- Track response submission success and failure events.
