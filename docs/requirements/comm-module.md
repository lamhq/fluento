# Communication Practice Module

## Introduction

Communication practice enables learners to develop conversational skills in realistic scenarios and build confidence in everyday interactions.

## How it works

Learners respond to a prompt and then receive feedback from the app.

## Accessing the module

1. Learner selects **Communication** in the main menu.
2. On the **Communication screen**, options include:
   - **Add New Sentence** button: add new sentence to their library.
   - **Practice** button: shows below configuration:
     - **Topics** (default: All)
     - **My Library Only** (default: off)
     - **Start Practice**: begins session.

## Practice Flow

1. App selects a **Exercise** based on the configuration.
2. App displays a prompt of that **Exercise**
3. Learner responds and clicks **Submit**.
4. App gives feedback about learner's response
5. Learner chooses:
   - **Retry**: re-answer same prompt.
   - **Next**: move to the next practice.

## Prompt display

Template for display exercise prompt in the app:

```
You're a/an [learner role] [scenario]

[counterpart role] said:
<bigText>"[prompt]"</bigText>

Response in a [style] manner:
<input box for user to type their response />
```

### Example 1: Ordering food in a restaurant

```
You're a customer ordering food in a restaurant

Waiter said:
<bigText>"What would you like to order?"</bigText>

Response in a polite manner:
<input box for user to type their response />
```

### Example 2: Introducing yourself

```
You're an interviewee introducing yourself in a job interview

Interviewer said:
<bigText>"Can you tell me a little about yourself?"</bigText>

Response in a professional manner:
<input box for user to type their response />
```

## Feedback display

Template for displaying feedback in the app:

```
[emoji icon] [total score]. [overall feedback message]

--- if spelling/grammar errors
Corrected Sentence:
"[corrected version of learner’s response]"

Fixes:
- [list of specific grammar/spelling fixes]

---

You can also say:
- "[expected response 1]"
- "[expected response 2]"
- "[expected response 3]"
```

**Emoji Mapping**:

- 🌟 Excellent (90–100): "🌟 Excellent work! Your response was clear and polished."
- 👍 Good (75–89): "👍 Good job! A few small issues, but overall strong."
- 🙂 Fair (60–74): "🙂 Fair effort. Needs improvement in clarity or grammar."
- ⚠️ Needs Improvement (40–59): "⚠️ Needs improvement. Several errors affected understanding."
- ❌ Poor (0–39): "❌ Response was unclear or inappropriate for the prompt."

### 🌟 Excellent Example

```
🌟 95/100. Excellent work! Your response was clear and polished.

---

Corrected Sentence:
"Let's meet tomorrow to discuss the project."

Fixes:
- "Lets" → "Let's"

---

You can also say:
- "I’d be happy to meet tomorrow to talk about the project."
- "Tomorrow works well for me. Let’s discuss the details then."
- "Sure, let’s meet tomorrow to go over the project."
```

### 👍 Good Example

```
👍 82/100. Good job! A few small issues, but overall strong.

---

Corrected Sentence:
"I agree with your idea, but we should also consider other options."

Fixes:
- "I am agree" → "I agree"

---

You can also say:
- "That’s a good idea. I agree, though we might explore alternatives too."
- "I agree with you, but let’s think about other possibilities as well."
- "I like your idea. Maybe we can also consider different approaches."
```

### 🙂 Fair Example

```
🙂 68/100. Fair effort. Needs improvement in clarity or grammar.

---

Corrected Sentence:
"I think this plan is good, but it need more details."

Fixes:
- "it need" → "it needs"

---

You can also say:
- "This plan looks good, but it needs more details."
- "I think the plan is fine, though we should add more specifics."
- "It’s a good start, but more detail would make it stronger."
```

### ⚠️ Needs Improvement Example

```
⚠️ 52/100. Needs improvement. Several errors affected understanding.

---

Corrected Sentence:
"I don’t understand your idea clearly."

Fixes:
- "I don’t understand your idea clear" → "I don’t understand your idea clearly"

---

You can also say:
- "Could you explain your idea more clearly?"
- "I’m not sure I understand. Can you give more details?"
- "Can you clarify what you mean by that?"
```

### ❌ Poor Example

```
❌ 28/100. Response was unclear or inappropriate for the prompt.

---

Corrected Sentence:
"I don’t like."

Fixes:
- Sentence incomplete → "I don’t like that idea."

---

You can also say:
- "I don’t think that idea will work. Could we try another approach?"
- "I’m not sure I agree with that suggestion."
- "That idea may not be the best fit. Let’s consider alternatives."
```

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

## Feedback model

Feedback includes:

- **Feedback**: overall feedback
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

## AI prompt

Prompt sent to AI for getting feedback on learner's response:

```md
## Task

Review my sentence and give feedback for correctness and relevance to the provided prompt.

## Inputs

- **Prompt:** _Politely request to your friend to take you to the airport_
- **Sentence:** "I was hoping you could give me a lift to the airport"

## Feedback structure

Feedback includes:

- **Feedback**: overall feedback
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
```

## Example Exercises

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
