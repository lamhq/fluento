# Sentence Construction

## Flow

1. App selects a sentence (satisfying the configuration) and extracts the most important N words (N=4).
2. App displays a prompt: "Write a sentence using the following words: [word1], [word2], ...[wordN]"
3. Learner writes a sentence and clicks **Submit**.
4. App gives feedback about learner's response.
5. Learner chooses:
   - **Retry**: re-answer with same words.
   - **Next**: move to the next exercise.

## Feedback

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

## Example Practices

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

## Prompts

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
