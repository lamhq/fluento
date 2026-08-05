# Articulation Practice

## Introduction

Articulation practice enables learners to articulate their thoughts and opinions clearly through various exercises.

## How it works

Learners practice through these exercise types:

- **Sentence Construction:** building sentences from keywords
- **Sentence Variation:** constructing different sentences with the same meaning
- **Paragraph Variation:** rewriting paragraphs with the same meaning

## Accessing the module

1. Learner selects **Articulation** in the main menu.
2. On the **Articulation screen**, options include:
   - **Add New** button: add new sentence/paragraph to their library.
   - **Practice** button: shows below configuration:
     - **Topics** (default: All)
     - **Exercises**: Sentence Construction, Sentence Variation, Paragraph Variation; default: All
     - **My Library Only** (default: off)
     - **Start Practice**: begins session.

## Sentence Construction

### Flow

1. App selects a sentence (satisfying the configuration) and extracts the most important N words (N=4).
2. App displays a prompt: "Write a sentence using the following words: [word1], [word2], ...[wordN]"
3. Learner writes a sentence and clicks **Submit**.
4. App gives feedback about learner's response.
5. Learner chooses:
   - **Retry**: re-answer with same words.
   - **Next**: move to the next exercise.

### Feedback

Feedback includes:

- **Feedback**: overall feedback
- **Correctness**: check spelling & grammar of learner's response
  - **Score** (x/100)
  - **Feedback**: correctness feedback
  - **Grammar/spelling fixes**
  - **Corrected sentence**
- **Completeness**: check if all required words are used
  - **Score** (x/100)
  - **Feedback**: which words are missing or improperly used
- **Alternatives**: three sentences that feel more fluid and natural

### Example Practices

**Exercise 1: Sentence Construction**

- **Required words**: hope, travel, soon
- **Example learner input**: "I hope to travel soon."
- **App feedback**:
  - Correctness: 98/100 (Perfect grammar and spelling)
  - Completeness: 100/100 (All words used correctly)

**Exercise 2: Sentence Construction**

- **Required words**: beautiful, garden, flowers
- **Example learner input**: "The beautiful flowers in the garden are blooming."
- **App feedback**:
  - Correctness: 97/100 (Excellent structure and grammar)
  - Completeness: 100/100 (All words incorporated well)

### Prompts

Prompt for getting feedback for learner's response:

```md
## Task

Review the provided sentence and give feedback on correctness and word usage.

## Inputs

- **Words:** exciting, adventure, mountain
- **Sentence:** "The mountain adventure was so exciting!"

## Feedback Structure

- **Feedback**: overall feedback
- **Correctness**: check spelling & grammar of learner's response
  - **Score** (x/100)
  - **Feedback**: correctness feedback
  - **Grammar/spelling fixes**
  - **Corrected sentence**
- **Completeness**: check if all required words are used
  - **Score** (x/100)
  - **Feedback**: which words are missing or improperly used
- **Alternatives**: three sentences that feel more fluid and natural
```

## Sentence Variation

### Flow

1. App selects a sentence (satisfying the configuration).
2. App displays a prompt: "Rewrite the following sentence with the same meaning: [sentence]"
3. Learner writes a sentence and clicks **Submit**.
4. App gives feedback about learner's response.
5. Learner chooses:
   - **Retry**: re-answer with the same sentence.
   - **Next**: move to the next exercise.

### Feedback

Feedback includes:

- **Feedback**: overall feedback
- **Correctness**: check spelling & grammar of learner's response
  - **Score** (x/100)
  - **Feedback**: correctness feedback
  - **Grammar/spelling fixes**
  - **Corrected sentence**
- **Meaning Preservation**: check if the rewritten sentence preserves the original meaning
  - **Score** (x/100)
  - **Feedback**: how well the meaning is preserved
- **Alternatives**: three sentences that feel more fluid and natural

### Example Practices

**Exercise 3: Sentence Variation**

- **Original sentence**: "I really enjoyed the movie."
- **Example learner input**: "The movie was really enjoyable."
- **App feedback**:
  - Correctness: 96/100 (Well-formed sentence)
  - Meaning Preservation: 95/100 (Meaning is well preserved with slight nuance change)

**Exercise 4: Sentence Variation**

- **Original sentence**: "She studied hard for the exam."
- **Example learner input**: "She prepared thoroughly by studying for the exam."
- **App feedback**:
  - Correctness: 94/100 (Good grammar, slightly verbose)
  - Meaning Preservation: 88/100 (Meaning preserved but added concept of "thoroughly")

### Prompts

Prompt for getting feedback for learner's response:

```md
## Task

Review the rewritten sentence and give feedback on correctness and meaning preservation.

## Inputs

- **Original sentence:** "She was very happy about the news."
- **Rewritten sentence:** "The news made her extremely happy."

## Feedback Structure

- **Feedback**: overall feedback
- **Correctness**: check spelling & grammar of learner's response
  - **Score** (x/100)
  - **Feedback**: correctness feedback
  - **Grammar/spelling fixes**
  - **Corrected sentence**
- **Meaning Preservation**: check if the rewritten sentence preserves the original meaning
  - **Score** (x/100)
  - **Feedback**: how well the meaning is preserved
- **Alternatives**: three sentences that feel more fluid and natural
```

## Paragraph Variation

### Flow

1. App select a paragraph (satisfying the configuration).
2. App displays a prompt: "Rewrite the following paragraph with the same meaning: [paragraph]"
3. Learner writes a paragraph and clicks **Submit**.
4. App gives feedback about learner's response.
5. Learner chooses:
   - **Retry**: re-answer with the same paragraph.
   - **Next**: move to the next exercise.

### Feedback

Feedback includes:

- **Feedback**: overall feedback
- **Correctness**:
  - **Score** (x/100)
  - **Sentences**: check spelling & grammar of each sentence in learner's response
    - **Score** (x/100)
    - **Feedback**: correctness feedback
    - **Grammar/spelling fixes**
    - **Corrected sentence**
- **Meaning Preservation**: check if the rewritten paragraph preserves the original meaning
  - **Score** (x/100)
  - **Feedback**: how well the overall meaning and structure are preserved

### Prompts

Prompt for getting feedback for learner's response:

```md
## Task

Review the rewritten paragraph and give feedback on correctness and meaning preservation.

## Inputs

- **Original paragraph:** "The weather was beautiful. I decided to go for a walk. The park was full of people enjoying the day. I met an old friend there."
- **Rewritten parapgraph:** "Beautiful weather inspired me to visit the park. At where I unexpectedly encountered an old friend. He is among the many people enjoying the day."

## Feedback Structure

- **Feedback**: overall feedback
- **Correctness**:
  - **Score** (x/100)
  - **Sentences**: Check spelling & grammar for each sentence in the rewritten paragraph.
    - **Score** (x/100)
    - **Feedback**: correctness feedback
    - **Grammar/spelling fixes**
    - **Corrected sentence**
- **Meaning Preservation**: check if the rewritten paragraph preserves the original meaning
  - **Score** (x/100)
  - **Feedback**: how well the overall meaning and structure are preserved
```

### Example Practices

**Exercise 5: Paragraph Variation**

- **Original paragraph**: "The weather was beautiful. I decided to go for a walk. The park was full of people enjoying the day. I met an old friend there."
- **Example learner input**: "Beautiful weather inspired me to visit the park, where I unexpectedly encountered an old friend among the many people enjoying the day."
- **App feedback**:
  - Correctness: 95/100 (Well-structured and grammatically sound)
  - Meaning Preservation: 92/100 (All main ideas preserved in condensed form)

## Add New

Steps TBD: adding sentences with prompt, intent, topics.
