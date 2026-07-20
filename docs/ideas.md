## Introduction

This document contains notes and ideas for a web application designed to help English learners practice their skills.

The app aims to enhance English fluency and communication through practical exercises and real-world scenarios.

It is designed to be user-friendly, engaging, and accessible for learners of all levels.

The app focuses on practicing rather than teaching, so users are expected to have some basic knowledge of English before using it.

Currently, the app supports the following features:
- **Communication practice**
- **Thinking practice**
- **Speaking practice**
- **Vocabulary practice** (including phrases)

---

## Communication practice

Communication practice enables learners to develop conversational skills in realistic scenarios and build confidence in everyday interactions.

### How it works
Learners respond to prompts or reply in simulated conversations, receiving feedback on grammar, pronunciation, and tone.

### Main Flow
1. Learner selects **Communication** in the main menu.  
2. On the **Communication screen**, options include:  
   - **Add New Sentence** button: add sentences to personal library.  
   - **Practice** button: shows below configuration:
     - **Topics** (default: All)  
     - **My Library Only** (default: off)  
     - **Start Practice**: begins session.  

### Add New Sentence Flow
- Steps TBD: adding sentences with prompt, intent, topics.

### Practice Flow
1. App secretly selects a practice sentence (satisfying the configuration) and shows a prompt.
2. Learner responds and clicks **Submit**.  
3. App gives feedback:  
   - **Score** (how the response fits the scenario)
   - **Corrected sentence** (grammar/spelling fixes)  
   - **Expected response** (if far from practice sentence).
4. Learner chooses:  
   - **Retry**: re-answer same prompt.  
   - **Next**: move to the next practice.

### Example Practices

**Practice 1**:
- **Intent**: Asking for a favor
- **Practice sentence**: "I was hoping you could give me a lift to the airport."
- **App display (prompt)**: Politely request to your friend to take you to the airport.

**Practice 2**:
- **Intent**: Responding small talk
- **Practice sentence**: "I've been doing well, thanks for asking. How about you?"
- **App display (prompt)**: "How have you been?" (a person that you haven't seen in a while asks you)

**Practice 3**:
- **Intent**: Showing gratitude
- **Practice sentence**: "You're welcome! I'm glad I could help."
- **App display (prompt)**: "Thank you for your help!" (someone that you helped with a task says this to you)

**Practice 4**:
- **Intent**: Sharing opinions
- **Practice sentence**: "I reckon you're a little young to be getting married"
- **App display (prompt)**: Giving opinion politely to your friend about her being too young to get married.

**Practice 5**:
- **Intent**: Polite corrections
- **Practice sentence**: "You seem to have made a mistake in your calculations."
- **App display (prompt)**: Your friend made a mistake in his calculation. Correct your friend's mistake politely.

---

## Thinking Practice

Expressing ideas helps learners articulate their thoughts and opinions clearly.

### How it works
Learns practice through these exercises:
- **Sentence Construction:** building sentences from keywords
- **Sentence Variation:** constructing different sentences with the same meaning
- **Paragraph Variation:** rewriting paragraphs with the same meaning

### Main Flow  
1. Learner selects **Thinking** in the main menu.  
2. On the **Thinking screen**, options include:  
   - **Add New Sentence** button: add sentence to personal library.
   - **Practice** button: shows below configuration:
     - **Topics** (default: All)  
     - **Exercises** (Sentence Construction, Variation, Paragraph Variation; default: All)  
     - **My Library Only** (default: off)  
     - **Start Practice**: begins session.  

### Add New Sentence Flow
- Steps TBD: adding sentences with prompt, intent, topics.

### Sentence Builder Flow  
1. App secretly selects a sentence (satisfying the configuration), extracts the most important N words
2. App shows a prompt "Write a sentence using the following words: [word1], [word2], ...[wordN]"
3. Learner writes a sentence and clicks **Submit**.  
4. App gives feedback:  
   - **Score** (100 if the sentence is correct and uses all words)  
   - **Grammar/spelling fixes**
   - **Alternatives**.
5. Learner chooses:  
   - **Retry**: re-answer with same words.  
   - **Next**: move forward to the next exercise.

### Sentence Variation Flow
1. App secretly selects a sentence (satisfying the configuration)
2. App shows a prompt "Rewrite the following sentence with the same meaning: [sentence]"
3. Learner writes a sentence and clicks **Submit**.
4. App gives feedback:  
   - **Score** (100 if the sentence is correct and preserves the meaning)  
   - **Grammar/spelling fixes**
   - **Alternatives**.
5. Learner chooses:  
   - **Retry**: re-answer with the same sentence.  
   - **Next**: move forward to the next exercise.

### Paragraph Variation Flow
1. App builds a paragraph from 4-7 sentences (satisfying the configuration)
2. App shows a prompt "Rewrite the following paragraph with the same meaning: [paragraph]"
3. Learner writes a paragraph and clicks **Submit**.
4. App gives feedback:  
   - **Score** (100 if the paragraph is correct and preserves the meaning)  
   - **Grammar/spelling fixes**
5. Learner chooses:  
   - **Retry**: re-answer with the same paragraph.  
   - **Next**: move forward to the next exercise.

---

## Speaking practice

Improve pronunciation, fluency, and confidence in speaking English through listening to native speakers and repeating what they hear (shadowing).

### How it works
- **Youtube Integration:** Learners can add sentences from YouTube videos to practice shadowing (or they can choose from the app's library).
- **User-Friendly Interface:** The app provides an easy-to-use interface for learners to play, pause, and repeat audio segments.
- **Instant Pronunciation Scoring:** Speech recognition highlights words or phonemes where accent or stress differs from the reference audio.
- **Recording & Comparison:** Built-in recording functionality allows learners to compare their speech with native audio to identify areas for improvement.

### Main Flow
1. Learner selects **Speaking** in the main menu.
2. On the **Speaking screen**, options include:
   - **Add New Sentence** button: add sentences to personal library.
   - **Practice** button: shows below configuration:
     - **Topics** (default: All)  
     - **My Library Only** (default: off)  
     - **Start Practice**: begins session.

### Add New Sentence Flow
- Steps TBD: adding sentences with prompt, intent, topics.

### Practice Flow
1. App secretly selects a sentence (satisfying the configuration)
2. App displays the shadowing screen with the following:
   - **Audio Player**: play, pause, and repeat the audio of the sentence
   - **Talk Button**: record learner's speech
3. Learner listens to the audio
4. Learner clicks **Talk** to speak.
5. App provides feedback:
   - **Sentence**: the sentence to practice
   - **Pronunciation Score** (0-100)
   - **Highlighted Words/Phonemes** where accent or stress differs from the reference audio
6. Learner chooses:
   - **Retry**: speak again and improve pronunciation
   - **Next**: move forward to the next exercise

---

## Vocabulary practice

Vocabulary practice helps learners build and reinforce their English word knowledge, moving beyond memorization to active retention and contextual use.

### How it works
- **Sentence Builder:** use the target vocabulary in different contexts by building sentences (e.g., workplace emails, casual chats).
- **Just One Word:** Learners guess a secret word based on contextual clues.
- **Flashcards:** Digital flashcards for quick review and self-testing.
- **Custom Word Banks:** learners can save new words and phrases, organized by topic to personalized vocabulary lists.
- **Spaced Repetition System:** Learners revisit challenging words through spaced repetition algorithms to ensure long-term retention.

### Main flow
1. Learner selects the Vocabulary section in the app's main menu.
2. Learner is presented in the Vocabulary Practice main screen with the following options:
  - **Add New Word** button: allow learners to add new words and phrases to their personal word bank
  - **Practice** button: clicking this button will expand below configuration section:
    - **Topics:** select topics to practice, "All Topics" is selected by default
    - **Exercises:** select type of exercises to practice (Sentence Builder, Just One Word, Flashcards), "All Exercises" is selected by default
    - **My library Only:** limit practice to words and phrases in the learner's personal word bank only, off by default
    - **Start Practice button:** clicking this button will start the practice session with one of the selected exercises and configuration

#### Add New Word flow
- TODO: add steps when a learner adds new words and phrases to their personal word bank, including the word/phrase, topics, meaning, example usage (sentences).

#### Sentence Builder flow
1. App show a prompt with a target word or phrase and a context (e.g., "Write a sentence using the word 'resilient' in a workplace email").
2. Learner types a sentence and submits it.
3. App provides feedback on the sentence, including score, grammar, vocabulary usage, and displays more appropriate sentences (if the score is less than 90/100).
4. Learner taps:
   - "Retry" button to type another sentence using the same word or phrase
   - "Next" button to continue

#### Just One Word flow
1. App shows a prompt "Guess the word/phrase from these clues" with a list of words/phrases (clues).
2. Learner types their guess and submits it.
3. App shows:
   - the result (Correct or Wrong) 
   - the correct word/phrase 
   - meaning of the target word/phrase
   - 2 example sentences with the target word/phrase.
4. Learner taps "Next" button to continue

#### Flashcards flow
1. App shows a flashcard with the meaning on the front side (e.g., "Able to recover quickly from difficulties")
2. Learner taps the Reveal button to show the answer with the word and example sentences (e.g., "Resilient", "She remained resilient in the face of adversity").
3. Learner taps "Next" button to continue
