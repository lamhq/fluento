# Vocabulary Practice

## Introduction

Vocabulary practice helps learners build and reinforce their English word knowledge through multiple exercise types that move beyond memorization to active retention and contextual use.

## How it works

Learners practice through these exercise types:
- **Sentence Builder:** use target vocabulary in different contexts by building sentences (e.g., workplace emails, casual chats)
- **Just One Word:** guess a secret word based on contextual clues
- **Flashcards:** digital flashcards for quick review and self-testing

## Data Model

Vocabulary structure:
```json
{
  "word": "present",
  "meanings": [
    {
      "context": "Current Time",
      "grammatical_category": "Noun",
      "definition": "The current period or moment occurring right now.",
      "example_sentence": "Focus on the present rather than worrying about what might happen tomorrow."
    },
    {
      "context": "Physical Presence & Attendance",
      "grammatical_category": "Adjective",
      "definition": "Being in a specific place or attending an event, rather than absent.",
      "example_sentence": "All students were present in the classroom for the history lecture."
    },
    {
      "context": "Gifts & Tokens",
      "grammatical_category": "Noun",
      "definition": "A gift given to someone to express gratitude or celebrate an occasion.",
      "example_sentence": "She wrapped the birthday present in colorful paper and tied it with a bow."
    },
    {
      "context": "Formally Showing or Giving",
      "grammatical_category": "Verb",
      "definition": "Formally giving, handing over, or awarding something to someone.",
      "example_sentence": "The mayor will present the bravery award to the local firefighter."
    },
    {
      "context": "Speeches, Demonstrations & Performance",
      "grammatical_category": "Verb",
      "definition": "Formally explaining, pitching, or showing an idea or project to an audience.",
      "example_sentence": "Our team will present the new quarterly sales strategy to the executives tomorrow."
    },
    {
      "context": "Introducing People",
      "grammatical_category": "Verb",
      "definition": "Formally introducing one person to another or bringing someone onto a stage.",
      "example_sentence": "May I present our keynote speaker for this evening's gala?"
    }
  ]
}
```

## Accessing the module

1. Learner selects **Vocabulary** in the main menu.
2. On the **Vocabulary Practice screen**, options include:
   - **Add New Word** button: add new words and phrases to their personal word bank
   - **Practice** button: shows below configuration:
     - **Topics** (default: All Topics)
     - **Exercises**: Sentence Builder, Just One Word, Flashcards; default: All Exercises
     - **My Library Only** (default: off)
     - **Start Practice**: begins session

## Sentence Builder

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
- **Vocabulary Usage**: check if the target word/phrase is used appropriately
  - **Score** (x/100)
  - **Feedback**: how well the word/phrase is used in context
- **Alternatives**: three sentences that feel more fluid and natural

### Example Practices

**Practice Lesson 1: Sentence Builder**
- **Target word**: resilient
- **Context**: workplace email
- **Example learner input**: "I believe our team is resilient and can overcome this challenge."
- **App feedback**:
  - Correctness: 98/100 (Perfect grammar and spelling)
  - Vocabulary Usage: 95/100 (Word used appropriately in professional context)

**Practice Lesson 2: Sentence Builder**
- **Target word**: innovative
- **Context**: casual chat
- **Example learner input**: "That's such a innovative idea for the project."
- **App feedback**:
  - Correctness: 92/100 (Minor article error: "an" instead of "a")
  - Vocabulary Usage: 96/100 (Word used correctly and naturally)

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
Review the sentence and give feedback on correctness and vocabulary usage.

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
- **Vocabulary Usage**: check if the target word/phrase is used appropriately
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
- **Result**: Correct or Wrong
- **Target word/phrase**: the correct answer
- **Meaning**: definition of the target word/phrase
- **Example sentences**: three sentences demonstrating the word/phrase in context

### Example Practices

**Practice Lesson 3: Just One Word**
- **Clues**: "endure", "adapt", "tough", "bounce"
- **Target word**: resilient
- **App feedback**:
  - Result: Correct ✓
  - Meaning: Able to recover quickly from difficulties
  - Example sentences: "She remained resilient in the face of adversity." / "The resilient community rebuilt after the disaster."

**Practice Lesson 4: Just One Word**
- **Clues**: "new ideas", "novel", "creative", "advanced"
- **Target word**: innovative
- **App feedback**:
  - Result: Correct ✓
  - Meaning: Introducing new ideas or methods
  - Example sentences: "The company is known for its innovative products." / "Her innovative approach solved the problem."

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
- **Word/phrase**: the target vocabulary
- **Meaning**: definition shown on the front of the card
- **Example sentences**: contextual examples demonstrating usage

### Example Practices

**Practice Lesson 5: Flashcards**
- **Front**: "Able to recover quickly from difficulties"
- **Back**: "Resilient"
- **Example sentences**:
  - "She remained resilient in the face of adversity."
  - "The resilient community rebuilt after the disaster."

**Practice Lesson 6: Flashcards**
- **Front**: "Introducing new ideas or methods"
- **Back**: "Innovative"
- **Example sentences**:
  - "The company is known for its innovative products."
  - "Her innovative approach solved the problem."

## Add New Word

Steps TBD: adding words and phrases to personal word bank, including the word/phrase, topics, meaning, example usage (sentences).
