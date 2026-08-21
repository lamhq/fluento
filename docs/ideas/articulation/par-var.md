# Paragraph Variation

## Flow

1. App select a paragraph (satisfying the configuration).
2. App displays a prompt: "Rewrite the following paragraph with the same meaning: [paragraph]"
3. Learner writes a paragraph and clicks **Submit**.
4. App gives feedback about learner's response.
5. Learner chooses:
   - **Retry**: re-answer with the same paragraph.
   - **Next**: move to the next exercise.

## Feedback

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

## Prompts

Prompt for getting feedback for learner's response:

```md
## Task

Review the rewritten paragraph and give feedback on correctness and meaning preservation.

## Inputs

- **Original paragraph:** "The weather was beautiful. I decided to go for a walk. The park was full of people enjoying the day. I met an old friend there."
- **Rewritten paragraph:** "Beautiful weather inspired me to visit the park. At where I unexpectedly encountered an old friend. He is among the many people enjoying the day."

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

## Example Practices

**Exercise 5: Paragraph Variation**

- **Original paragraph**: "The weather was beautiful. I decided to go for a walk. The park was full of people enjoying the day. I met an old friend there."
- **Example learner input**: "Beautiful weather inspired me to visit the park, where I unexpectedly encountered an old friend among the many people enjoying the day."
- **App feedback**:
  - Correctness: 95/100 (Well-structured and grammatically sound)
  - Meaning Preservation: 92/100 (All main ideas preserved in condensed form)
