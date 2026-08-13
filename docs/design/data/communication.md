# Communication Module Data Model

## Exercise model

An **Exercise** includes:

### Topics

Broad thematic categories that group exercises.

Examples: "Restaurant", "Job Interview", "School", "Socializing".

### Scenario

The specific real-world situation or setting where the conversation happens.

The scenario must fit this template: "You're a/an [learner role] [scenario]".

Examples:

- ordering food in a restaurant
- introducing yourself in a job interview
- asking a teacher for help with homework
- asking a friend for a favor to take you to the airport

### Learner Role

Defines who the learner is in the scenario.

Examples: customer, interviewee, student, person.

### Counterpart Role

Who the learner interacts with.

Examples: waiter, interviewer, teacher, friend.

### Prompts

Initial statements that start the conversation.

Can be:

- A speech that starts the conversation from the counterpart.
- A prompt that guides the response.

Examples:

- Say that you would like to order a meal (prompt).
- "Can you tell me a little about yourself?" (speech)
- Ask the teacher guidance for solving a math problem (prompt).
- Politely ask your friend to take you to the airport (prompt, cannot be a speech since the learner starts the conversation).

### Expected Responses

The ideal or expected responses to the prompts.

Each expected response includes:

- **Content**: the sentence in speaking form.
- **Style**: the manner of delivery — tone, politeness, formality, or cultural appropriateness.

Examples:

- "I would like to order the grilled salmon, please." (polite, simple)
- "Hello, I'm Beck. I have a degree in computer science and have been working in software development for the past five years." (professional, concise)
- "Could you please help me with this math problem? I'm having trouble understanding it." (polite, respectful)
- "I was hoping you could give me a lift to the airport" (polite, courteous)

### Example 1: Ordering food in a restaurant

```json
{
  "topic": "Restaurant",
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
  ]
}
```

### Example 2: Introducing yourself

```json
{
  "topic": "Job Interview",
  "scenario": "introducing yourself",
  "learnerRole": "interviewee",
  "counterpartRole": "interviewer",
  "prompts": ["\"Can you tell me a little about yourself?\""],
  "expectedResponses": [
    {
      "content": "Hello, I'm Beck. I have a degree in computer science and have been working in software development for the past five years.",
      "style": ["professional", "concise"]
    },
    {
      "content": "My name is Sarah. I recently graduated with a degree in marketing and completed an internship where I focused on digital campaigns.",
      "style": ["professional", "confident"]
    }
  ]
}
```

### Example 3: Asking for explanation

```json
{
  "topic": "School",
  "scenario": "asking for explanation",
  "learnerRole": "student",
  "counterpartRole": "teacher",
  "prompts": ["Ask the teacher guidance for solving a math problem."],
  "expectedResponses": [
    {
      "content": "Could you please help me with this math problem? I'm having trouble understanding it.",
      "style": ["polite", "respectful"]
    },
    {
      "content": "I'm struggling with this equation. Could you explain how to solve it?",
      "style": ["polite", "curious"]
    }
  ]
}
```

### Example 4: Asking for a favor

```json
{
  "topic": "Socializing",
  "scenario": "asking for a favor",
  "learnerRole": "person",
  "counterpartRole": "friend",
  "prompts": ["Politely ask your friend to take you to the airport."],
  "expectedResponses": [
    {
      "content": "I was hoping you could give me a lift to the airport.",
      "style": ["polite", "courteous"]
    },
    {
      "content": "Would you mind driving me to the airport tomorrow morning?",
      "style": ["friendly", "considerate"]
    }
  ]
}
```

## Feedback model

Feedback includes:

- **Feedback**: overall feedback message
- **Correctness**: check spelling & grammar of learner's response
  - **Score** (x/100)
  - **Feedback**: correctness feedback
  - **Grammar/spelling fixes**
  - **Corrected sentence**
- **Appropriateness**: check response is relevant with the prompt
  - **Score** (x/100): `0` if the response is irrelevant with the prompt, otherwise it's the average of clarity, politeness, and tone scores.
  - **Clarity**: Is the response easy to understand and free of ambiguity?
    - **Score** (x/100)
    - **Feedback**
  - **Politeness**: Does it show courtesy or acknowledge the other person?
    - **Score** (x/100)
    - **Feedback**
  - **Tone**: Does the emotional tone fit the situation (friendly, professional, humorous)?
    - **Score** (x/100)
    - **Feedback**
- **Alternatives**: alternative responses that are also can be used in the same scenario.

**Considerations**:

- Should **Engagement** be included as a criterion for appropriateness?
