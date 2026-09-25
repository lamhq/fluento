# Vocabulary Practice

## Introduction

Vocabulary practice helps learners build and reinforce their English word knowledge through multiple exercise types that move beyond memorization to active retention and contextual use.

## How it works

Learners practice through these exercise types:

- **Using Word:** use target vocabulary in different contexts by building sentences (e.g., workplace emails, casual chats)
- **Just One Word:** guess a secret word based on contextual clues
- **Flashcards:** digital flashcards for quick review and self-testing

## Data Model

Vocabulary structure:

```json
{
  "name": "Present",
  "skill": "vocabulary",
  "format": "word",
  "topics": ["Time", "Daily Life"],
  "word": "present",
  "meaning": "The current period or moment occurring right now.",
  "example_sentences": [
    "Focus on the present rather than worrying about what might happen tomorrow."
  ],
  "clues": ["now", "current", "moment", "today"]
}
```

## Accessing the module

1. Learner selects **Vocabulary** in the main menu.
2. On the **Vocabulary Practice screen**, options include:
   - **Add New Word** button: add new words and phrases to their personal word bank
   - **Practice** button: shows below configuration:
     - **Topics** (default: All Topics)
     - **Exercises**: Using Word, Just One Word, Flashcards; default: All Exercises
     - **My Library Only** (default: off)
     - **Start Practice**: begins session

## Using Word

### Flow

1. App displays a prompt with a target **word/phrase** and a **context** (e.g., "Write a sentence using the word 'resilient' in a workplace email").
2. Learner writes a sentence and clicks **Submit**.
3. App gives feedback about learner's response.
4. Learner chooses:
   - **Retry**: re-answer with the same word/phrase
   - **Next**: move to the next exercise

### Feedback

Feedback includes:

- **Feedback**: overall feedback
- **Correctness**: check spelling & grammar of learner's response
  - **Score** (x/100)
  - **Feedback**: correctness feedback
  - **Grammar/spelling fixes**
  - **Corrected sentence**
- **Appropriateness**: check if the target word/phrase is used appropriately
  - **Score** (x/100)
  - **Feedback**: how well the word/phrase is used in context
- **Alternatives**: three sentences that feel more fluid and natural

### Example Practices

**Exercise 1: Using Word**

- **Target word**: resilient
- **Context**: workplace email
- **Example learner input**: "I believe our team is resilient and can overcome this challenge."
- **App feedback**:
  - Correctness: 98/100 (Perfect grammar and spelling)
  - Appropriateness: 95/100 (Word used appropriately in professional context)

**Exercise 2: Using Word**

- **Target word**: innovative
- **Context**: casual chat
- **Example learner input**: "That's such a innovative idea for the project."
- **App feedback**:
  - Correctness: 92/100 (Minor article error: "an" instead of "a")
  - Appropriateness: 96/100 (Word used correctly and naturally)

### Prompts

#### Get all contexts of a word

```md
## Task

Give me all the contexts in which the word 'present' can be used.

## Response format

A list of context names with short descriptions, starting with the most popular.
```

#### Provide feedback on learner's response

```md
## Task

Review the sentence and give feedback on correctness and appropriateness.

## Inputs

- **Target word:** resilient
- **Context:** workplace email
- **Sentence:** "I believe our team is resilient and can overcome this challenge."

## Feedback Structure

- **Feedback**: overall feedback
- **Correctness**: check spelling & grammar of learner's response
  - **Score** (x/100)
  - **Feedback**: correctness feedback
  - **Grammar/spelling fixes**
  - **Corrected sentence**
- **Appropriateness**: check if the target word/phrase is used appropriately
  - **Score** (x/100)
  - **Feedback**: how well the word/phrase is used in context
- **Alternatives**: three sentences that feel more fluid and natural
```

## Just One Word

### Flow

1. App displays a prompt "Guess the word/phrase from these clues" with 4 contextual clues (words/phrases).
2. Learner types their guess and clicks **Submit**.
3. App shows the result and feedback.
4. Learner chooses:
   - **Retry**: guess again (without feedback penalty)
   - **Next**: move to the next exercise

### Feedback

Feedback includes:

- **Score** (x/100)
- **Feedback**: overall feedback
- **Correctness**: whether the guessed word/phrase matches the target answer
  - **Score** (x/100)
  - **Feedback**: correctness feedback

The target word, meaning, and example sentences are exercise content shown as part of the result, not feedback fields stored on the attempt.

### Example Practices

**Exercise 3: Just One Word**

- **Clues**: "endure", "adapt", "tough", "bounce"
- **Target word**: resilient
- **App feedback**:
  - Score: 100/100
  - Feedback: Correct answer.
  - Correctness: 100/100 (The guessed word matches the target.)

**Exercise 4: Just One Word**

- **Clues**: "new ideas", "novel", "creative", "advanced"
- **Target word**: innovative
- **App feedback**:
  - Score: 100/100
  - Feedback: Correct answer.
  - Correctness: 100/100 (The guessed word matches the target.)

### Prompts

Getting clues for guessing a word:

```md
Give me 4 words (clues) for guessing the word "present" in a Just One Word exercise.
```

## Flashcards

### Flow

1. App displays a flashcard with the meaning on the front side (e.g., "Able to recover quickly from difficulties").
2. Learner taps the **Reveal** button to show the answer with the word and example sentences (e.g., "Resilient").
3. Learner chooses:
   - **Retry**: see another example or review the same card
   - **Next**: move to the next card

### Feedback

Feedback includes:

- **Score** (x/100)
- **Feedback**: overall feedback
- **Correctness**: whether the learner recalled or recognized the target word/phrase
  - **Score** (x/100)
  - **Feedback**: correctness feedback

The word/phrase, meaning, and example sentences are exercise content shown on the card, not feedback fields stored on the attempt.

### Example Practices

**Exercise 5: Flashcards**

- **Front**: "Able to recover quickly from difficulties"
- **Back**: "Resilient"
- **Example sentences**:
  - "She remained resilient in the face of adversity."
  - "The resilient community rebuilt after the disaster."

**Exercise 6: Flashcards**

- **Front**: "Introducing new ideas or methods"
- **Back**: "Innovative"
- **Example sentences**:
  - "The company is known for its innovative products."
  - "Her innovative approach solved the problem."

## Add New Word

Steps TBD: adding words and phrases to personal word bank, including the word/phrase, topics, meaning, example usage (sentences).
