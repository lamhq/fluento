# Communication Practice

## Introduction

Communication practice enables learners to develop conversational skills in realistic scenarios and build confidence in everyday interactions.

## How it works

Learners respond to a prompt then receive feedback from the app.

## Accessing the module

1. Learner selects **Communication** in the main menu.
2. On the **Communication screen**, options include:
   - **Add New Sentence** button: add new sentence to their library.
   - **Practice** button: shows below configuration:
     - **Topics** (default: All)
     - **My Library Only** (default: off)
     - **Start Practice**: begins session.

## Practice Flow

1. App selects a **practice lesson** based on the configuration.
2. App displays a prompt of that **practice lesson**
3. Learner responds and clicks **Submit**.
4. App gives feedback about learner's response
5. Learner chooses:
   - **Retry**: re-answer same prompt.
   - **Next**: move to the next practice.

## Practice Lessons

Practice lessons contain the following information:
- **Skill**: what to practice. For example:
  - asking for help
  - showing gratitude
- **Sentences**: sentences for learners to practice. For example:
  - "I was hoping you could give me a lift to the airport."
  - "You're welcome! I'm glad I could help."
- **Prompts**: prompts that lead to the practice sentences, can be:
  - a **guided prompt** that asks the learner to respond in a specific way, e.g., Politely request to your friend to take you to the airport.
  - an **opener sentence** with a realistic **scenario**, e.g., "Thank you for your help!" - someone that you helped with a task says this to you.
- **Topics**: topics that the practice lesson belongs to. For example:
  - Small talk
  - Job Interview

## App Feedback

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

### AI Prompts

Getting feedback on learner's response:
````md
## Task

Review my sentence and give feedback for correctness and relevance to the provided prompt.

## Inputs

- **Prompt:** _Politely request to your friend to take you to the airport_  
- **Sentence:** "I was hoping you could give me a lift to the airport.”

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

## Example Output

```json
{
  "prompt": "Politely request to your friend to take you to the airport",
  "sentence": "Cpuld you took me to the airport?",
  "feedback": "The sentence is understandable but contains grammatical and spelling errors. It does attempt to make a polite request, but the phrasing needs correction to be clear and appropriate.",
  "correctness": {
    "score": 60,
    "feedback": "There are issues with spelling ('Cpuld' instead of 'Could') and verb tense ('took' instead of 'take'). These errors affect clarity and correctness.",
    "fixes": [
      "Correct 'Cpuld' to 'Could'",
      "Change 'took' to 'take'"
    ],
    "correctedSentence": "Could you take me to the airport?"
  },
  "appropriateness": {
    "score": 85,
    "clarity": {
      "score": 80,
      "feedback": "The meaning is mostly clear, but the grammar mistakes make it slightly confusing."
    },
    "politeness": {
      "score": 90,
      "feedback": "The request is polite, though adding 'please' would make it even more courteous."
    },
    "tone": {
      "score": 85,
      "feedback": "The tone is friendly and suitable for asking a favor, but the errors reduce its smoothness."
    }
  }
}
```
````

## Example Practice Lessons

**Practice Lesson 1: Asking for help**
- **Prompt**: Politely request to your friend to take you to the airport.
- **User input**: "I was hoping you could give me a lift to the airport."
- **App feedback**:
  - Correctness: 95/100 (Well-structured sentence with good grammar)
  - Appropriateness: 92/100 (Polite and relevant)
    - Clarity: 100/100
    - Politeness: 92/100
    - Tone: 88/100

**Practice Lesson 3: Showing gratitude**
- **Prompt**: "Thank you for your help!" - someone that you helped with a task says this to you.
- **User input**: "You're welcome! I'm glad I could help."
- **App feedback**:
  - Correctness: 96/100 (Correct grammar and punctuation)
  - Appropriateness: 95/100 (Warm and appropriate response)
    - Clarity: 100/100
    - Politeness: 96/100
    - Tone: 96/100

**Practice Lesson 4: Sharing opinions**
- **Prompt**: Gently tell your friend she’s too young for marriage.
- **User input**: "I reckon you're a little young to be getting married."
- **App feedback**:
  - Correctness: 92/100 (Conversational and grammatically correct)
  - Appropriateness: 88/100 (Good balance of honesty and politeness)
    - Clarity: 96/100
    - Politeness: 88/100
    - Tone: 84/100

**Practice Lesson 5: Polite corrections**
- **Prompt**: Politely correct your friend’s calculation mistake.
- **User input**: "You seem to have made a mistake in this calculation."
- **App feedback**:
  - Correctness: 94/100 (Clear and grammatically sound)
  - Appropriateness: 89/100 (Diplomatic and constructive)
    - Clarity: 96/100
    - Politeness: 88/100
    - Tone: 80/100

**Practice Lesson 6: Responding to inquiries (enthusiastic)**
- **Prompt**: "How are you today?"
- **User input**: "I'm doing well, thank you. And you?"
- **App feedback**:
  - Correctness: 98/100 (Polished grammar and punctuation)
  - Appropriateness: 100/100 (Excellent, engaging response)
    - Clarity: 100/100
    - Politeness: 100/100
    - Tone: 100/100

**Practice Lesson 7: Responding to inquiries (casual, minimal)**
- **Prompt**: "How are you today?"
- **User input**: "Not too bad."
- **App feedback**:
  - Correctness: 90/100 (Casual but correct)
  - Appropriateness: 77/100 (Good but flat tone)
    - Clarity: 92/100
    - Politeness: 60/100
    - Tone: 80/100

**Practice Lesson 10: Responding to inquiries (irrelevant)**
- **Prompt**: "How are you today?"
- **User input**: "I had pizza last night."
- **App feedback**:
  - Correctness: 92/100 (Correct spelling and grammar)
  - Appropriateness: 0/100 (Irrelevant — doesn't answer the prompt)
    - Clarity: 100/100
    - Politeness: 80/100
    - Tone: 80/100

**Practice Lesson 11: Responding to inquiries (news)**
- **Prompt**: "What's new with you?"
- **User input**: "Not much, just relaxing today."
- **App feedback**:
  - Correctness: 96/100 (Well-formed casual response)
  - Appropriateness: 88/100 (Strong casual response)
    - Clarity: 96/100
    - Politeness: 80/100
    - Tone: 88/100

**Practice Lesson 12: Responding to inquiries (work)**
- **Prompt**: "How's work going?"
- **User input**: "It's been busy, but manageable."
- **App feedback**:
  - Correctness: 97/100 (Clear, well-structured sentence)
  - Appropriateness: 91/100 (Professional and honest)
    - Clarity: 100/100
    - Politeness: 80/100
    - Tone: 92/100

**Practice Lesson 13: Responding to inquiries (weekend)**
- **Prompt**: "How was your weekend?"
- **User input**: "Great! I went hiking and it was refreshing."
- **App feedback**:
  - Correctness: 98/100 (Excellent grammar and detail)
  - Appropriateness: 96/100 (Excellent, engaging response)
    - Clarity: 100/100
    - Politeness: 88/100
    - Tone: 100/100

**Practice Lesson 2: Responding to inquiries (small talk)**
- **Prompt**: "How have you been?" - someone that you haven't seen in a while asks you.
- **User input**: "I've been doing well, thanks for asking. How about you?"
- **App feedback**:
  - Correctness: 98/100 (Excellent grammar and spelling)
  - Appropriateness: 100/100 (Excellent, engaging response)
    - Clarity: 100/100
    - Politeness: 100/100
    - Tone: 100/100
