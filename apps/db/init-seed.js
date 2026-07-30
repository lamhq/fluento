// Switch to the test database
db = db.getSiblingDB('test');

// Create indexes on activities collection
// db.activities.createIndex({ time: -1 });

// Seed example exercises for the communication practice module
db.exercises.deleteMany({});
db.exercises.insertMany([
  {
    name: 'Asking for help',
    sentences: [
      {
        content: 'I was hoping you could give me a lift to the airport.',
        style: 'polite and courteous',
        meaning: 'Tôi hy vọng bạn có thể đưa tôi đến sân bay.',
      },
    ],
    prompts: [
      {
        content: 'Politely request to your friend to take you to the airport.',
        style: 'casual and simple',
        meaning: 'Lịch sự yêu cầu bạn của bạn đưa bạn đến sân bay.',
      },
    ],
    topics: ['Asking for help', 'Everyday situations'],
  },
  {
    name: 'Showing gratitude',
    sentences: [
      {
        content: "You're welcome! I'm glad I could help.",
        style: 'warm and friendly',
        meaning: 'Không có gì đâu! Tôi rất vui vì mình đã giúp được.',
      },
    ],
    prompts: [
      {
        content: 'Thank you for your help! (said by someone you assisted)',
        style: 'friendly and appreciative',
        meaning: 'Cảm ơn vì đã giúp đỡ! (được nói bởi người mà bạn đã giúp)',
      },
    ],
    topics: ['Showing gratitude', 'Everyday situations'],
  },
  {
    name: 'Responding to inquiries',
    sentences: [
      {
        content: "I've been doing well, thanks for asking. How about you?",
        style: 'casual and engaging',
        meaning: 'Mình đang khá tốt, cảm ơn vì đã hỏi. Còn bạn thì sao?',
      },
    ],
    prompts: [
      {
        content:
          'How have you been? (Someone you have not seen in a while asks you)',
        style: 'friendly and conversational',
        meaning: 'Bạn đã ổn không? (Một người lâu rồi không gặp hỏi bạn)',
      },
    ],
    topics: ['Small talk', 'Everyday situations'],
  },
]);
