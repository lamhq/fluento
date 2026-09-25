print('Seeding data...');

const exercisesCol = db.getCollection('exercises');
const practicesCol = db.getCollection('learner_exercise_practices');
const topicsCol = db.getCollection('topics');
const usersCol = db.getCollection('users');
const userId = ObjectId('65f000000000000000000003');
const now = new Date();

// Exercise IDs
const exerciseIds = [
  ObjectId('65f000000000000000000001'),
  ObjectId('65f000000000000000000002'),
  ObjectId('65f000000000000000000003'),
  ObjectId('65f000000000000000000004'),
  ObjectId('65f000000000000000000005'),
  ObjectId('65f000000000000000000006'),
  ObjectId('65f000000000000000000007'),
  ObjectId('65f000000000000000000008'),
  ObjectId('65f000000000000000000009'),
  ObjectId('65f00000000000000000000a'),
  ObjectId('65f00000000000000000000b'),
  ObjectId('65f00000000000000000000c'),
  ObjectId('65f00000000000000000000d'),
  ObjectId('65f00000000000000000000e'),
];

const topicNames = [
  'Common',
  'Airport',
  'Travel',
  'Job Interview',
  'Software Engineering',
  'Mid-Autumn Festival',
];

exercisesCol.deleteMany({});
practicesCol.deleteMany({});
topicsCol.deleteMany({ name: { $in: topicNames } });
usersCol.deleteMany({ email: 'test@example.com' });

usersCol.insertOne({
  _id: userId,
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: null,
  createdAt: now,
  updatedAt: now,
});

topicsCol.insertMany(
  topicNames.map((name) => ({
    name,
    createdAt: now,
    updatedAt: now,
  })),
);

// Communication Exercises
const communicationExercises = [
  {
    _id: exerciseIds[0],
    userId,
    status: 'active',
    skill: 'communication',
    format: 'communication',
    topics: ['Common'],
    scenario: 'Answer small talk questions',
    learnerRole: 'participant',
    counterpartRole: 'questioner',
    prompts: ['What are you up to this weekend?'],
    expectedResponses: [
      {
        content: 'My parents are coming to visit. What about you?',
        style: ['conversational'],
      },
    ],
    references: [
      'https://www.youtube.com/post/UgkxxlFNH4jWYGJjnF80H7-9OdHlbtvRpBtS',
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[1],
    userId,
    status: 'active',
    skill: 'communication',
    format: 'communication',
    topics: ['Common'],
    scenario: 'Answer small talk questions',
    learnerRole: 'participant',
    counterpartRole: 'questioner',
    prompts: ['Did you have a nice weekend?'],
    expectedResponses: [
      {
        content:
          'Yeah, it was alright thanks. I just chilled at home. How about you?',
        style: ['casual'],
      },
    ],
    references: [
      'https://www.youtube.com/post/UgkxxlFNH4jWYGJjnF80H7-9OdHlbtvRpBtS',
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[2],
    userId,
    status: 'active',
    skill: 'communication',
    format: 'communication',
    topics: ['Common'],
    scenario: 'Answer small talk questions',
    learnerRole: 'participant',
    counterpartRole: 'questioner',
    prompts: ["Crazy weather we're having, aren't we?"],
    expectedResponses: [
      {
        content: "Yeah, it can't decide if it's summer or winter.",
        style: ['casual'],
      },
    ],
    references: [
      'https://www.youtube.com/post/UgkxxlFNH4jWYGJjnF80H7-9OdHlbtvRpBtS',
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[3],
    userId,
    status: 'active',
    skill: 'communication',
    format: 'communication',
    topics: ['Common'],
    scenario: 'Reject invitations',
    learnerRole: 'participant',
    counterpartRole: 'friend',
    prompts: ['Do you fancy going for a pint later?'],
    expectedResponses: [
      {
        content: 'Sorry, I have plans tonight, but maybe another time?',
        style: ['polite'],
      },
      { content: "I'd love to, but i'm busy this evening", style: ['polite'] },
      {
        content: "That sounds fun, but i'm completely wrapped up with work",
        style: ['apologetic'],
      },
      {
        content: "I'm visiting my parents tonight, but how about next week?",
        style: ['polite'],
      },
    ],
    references: ['https://youtu.be/H-HVm6hRbsI?si=UwH6Z34fGJwlNQQW'],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[4],
    userId,
    status: 'active',
    skill: 'communication',
    format: 'communication',
    topics: ['Common'],
    scenario: 'Exaggerate things',
    learnerRole: 'participant',
    counterpartRole: 'listener',
    prompts: ['Exaggerate something about yourself'],
    expectedResponses: [
      { content: "I'm literally starving!", style: ['casual'] },
      {
        content: "My head is literally exploding! I've done so much work today!",
        style: ['emphatic'],
      },
    ],
    references: ['https://www.youtube.com/watch?v=FinOIdu21XA'],
    createdAt: now,
    updatedAt: now,
  },
];

// Vocabulary Exercises
const vocabularyExercises = [
  {
    _id: exerciseIds[5],
    userId,
    status: 'active',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'customs',
    meaning:
      'The official procedures and formalities required by a country when entering or leaving it (hải quan).',
    sentences: ["At customs, they're going to ask for your passport and stamp it."],
    clues: ['passport', 'inspection', 'border', 'declaration', 'immigration'],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[6],
    userId,
    status: 'active',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'security',
    meaning:
      'The area where you have to get checked before entering the secure part of an airport (an ninh).',
    sentences: [
      "At security, they'll check your bags and ask you to remove your shoes.",
    ],
    clues: ['screening', 'scanner', 'metal detector', 'guard', 'queue'],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[7],
    userId,
    status: 'active',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'baggage claim',
    meaning:
      'The area in an airport where passengers collect their checked luggage after a flight (nhận hành lý).',
    sentences: ['After landing, head to baggage claim to pick up your suitcase.'],
    clues: ['luggage', 'carousel', 'claim ticket', 'lost and found', 'pickup'],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[8],
    userId,
    status: 'active',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'check-in counter',
    meaning:
      'The area in an airport where passengers go to check in for their flight and drop off their luggage (quầy làm thủ tục).',
    sentences: ['I need to go to the check-in counter to get my boarding pass.'],
    clues: ['check-in', 'boarding pass', 'luggage drop', 'queue', 'counter'],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[9],
    userId,
    status: 'active',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'self check-in',
    meaning:
      'The process where passengers check in for their flight and print their boarding passes using automated kiosks at the airport (tự làm thủ tục).',
    sentences: ['I prefer using the self check-in kiosks to save time.'],
    clues: ['kiosk', 'boarding pass', 'automated', 'self-service', 'queue'],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
];

// Articulation Exercises
const articulationExercises = [
  {
    _id: exerciseIds[10],
    userId,
    status: 'active',
    skill: 'articulation',
    format: 'sentence',
    topics: ['Job Interview', 'Software Engineering'],
    scenario: 'Talk about your background',
    prompts: ['Describe your educational background using provided words.'],
    words: ['study', 'computer science', 'university', "bachelor's degree"],
    expectedResponses: [
      {
        content:
          "I studied computer science at university and had a bachelor's degree.",
        style: ['formal'],
      },
    ],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[11],
    userId,
    status: 'active',
    skill: 'articulation',
    format: 'sentence',
    topics: ['Job Interview', 'Software Engineering'],
    scenario: 'Describe work experiences',
    prompts: [
      'Describe your work experience to the interviewer using provided words.',
    ],
    words: [
      'over / more than',
      '10 years',
      'software',
      'tech lead',
      'manage',
      'coding',
    ],
    expectedResponses: [
      {
        content:
          "I have over 10 years of experience in software development. For the past 6 years, I've worked as a tech lead, managing development teams, and doing hands-on coding.",
        style: ['formal'],
      },
    ],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[12],
    userId,
    status: 'active',
    skill: 'articulation',
    format: 'sentence',
    topics: ['Job Interview', 'Software Engineering'],
    scenario: 'Describe job expertise',
    prompts: ['Describe your skills and areas of expertise using provided words.'],
    words: [
      'web',
      'backend',
      'React',
      'Node.js',
      'TypeScript',
      'Cloud computing',
      'DevOps',
    ],
    expectedResponses: [
      {
        content:
          'I specialize in web and backend development using React, Node.js, TypeScript, Python, Cloud computing, and DevOps, and I have experience with Cloud computing and DevOps practices.',
        style: ['formal'],
      },
    ],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseIds[13],
    userId,
    status: 'active',
    skill: 'articulation',
    format: 'paragraph',
    topics: ['Mid-Autumn Festival'],
    scenario: 'Mid-Autumn Festival Introduction',
    prompts: [
      'Read and practice the following paragraph about the Mid-Autumn Festival.',
    ],
    paragraph:
      'The Mid-Autumn Festival is one of the most important traditional celebrations in Vietnam. It is usually held on the 15th day of the eighth lunar month when the moon is at its fullest and brightest. This festival is especially meaningful for children, who eagerly wait for the occasion each year. Families often gather together to enjoy mooncakes, fruits, and tea while admiring the beautiful moon. Children carry colorful lanterns and participate in joyful lantern parades around their neighborhoods. Lion dances are also a popular activity that brings excitement and good luck during the festival. Many people believe that the full moon symbolizes unity, happiness, and family reunion. Traditional folk stories, such as the tale of Cuội and the Moon Lady, are often shared with children. Schools and communities frequently organize cultural performances and games to celebrate the event. Overall, the Mid-Autumn Festival is a cherished Vietnamese tradition that strengthens family bonds and preserves cultural values.',
    words: [
      'Mid-Autumn Festival',
      '15th day',
      'mooncakes',
      'lanterns',
      'lion dances',
      'full moon',
      'family reunion',
    ],
    references: [],
    createdAt: now,
    updatedAt: now,
  },
];

exercisesCol.insertMany([
  ...communicationExercises,
  ...vocabularyExercises,
  ...articulationExercises,
]);

// Create practice records for all exercises
const practiceRecords = exerciseIds.map((exerciseId, index) => ({
  userId,
  exerciseId,
  practiceCount: Math.floor(Math.random() * 5),
  practicedAt: index % 3 === 0 ? new Date('2026-08-10T09:00:00Z') : null,
  createdAt: now,
  updatedAt: now,
}));

practicesCol.insertMany(practiceRecords);
