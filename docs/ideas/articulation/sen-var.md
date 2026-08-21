# Sentence Variation

## Flow

1. App selects a sentence (satisfying the configuration).
2. App displays a prompt: "Rewrite the following sentence with the same meaning: [sentence]"
3. Learner writes a sentence and clicks **Submit**.
4. App gives feedback about learner's response.
5. Learner chooses:
   - **Retry**: re-answer with the same sentence.
   - **Next**: move to the next exercise.

## Feedback

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

## Example Practices

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

## Prompts

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
