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
  'Everyday Conversation',
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
    name: 'Answer small talk questions',
    skill: 'communication',
    format: 'communication',
    topics: ['Everyday Conversation'],
    scenario: 'Answer small talk questions',
    learnerRole: 'participant',
    counterpartRole: 'questioner',
    prompts: ['What are you up to this weekend?'],
    validResponses: ['My parents are coming to visit. What about you?'],
    userId,
    status: 'active',
    references: [
      'https://www.youtube.com/post/UgkxxlFNH4jWYGJjnF80H7-9OdHlbtvRpBtS',
    ],
    updatedAt: now,
  },
  {
    _id: exerciseIds[1],
    name: 'Answer small talk questions',
    skill: 'communication',
    format: 'communication',
    topics: ['Everyday Conversation'],
    scenario: 'Answer small talk questions',
    learnerRole: 'participant',
    counterpartRole: 'questioner',
    prompts: ['Did you have a nice weekend?'],
    validResponses: [
      'Yeah, it was alright thanks. I just chilled at home. How about you?',
    ],
    userId,
    status: 'active',
    references: [
      'https://www.youtube.com/post/UgkxxlFNH4jWYGJjnF80H7-9OdHlbtvRpBtS',
    ],
    updatedAt: now,
  },
  {
    _id: exerciseIds[2],
    name: 'Answer small talk questions',
    skill: 'communication',
    format: 'communication',
    topics: ['Everyday Conversation'],
    scenario: 'Answer small talk questions',
    learnerRole: 'participant',
    counterpartRole: 'questioner',
    prompts: ["Crazy weather we're having, aren't we?"],
    validResponses: ["Yeah, it can't decide if it's summer or winter."],
    userId,
    status: 'active',
    references: [
      'https://www.youtube.com/post/UgkxxlFNH4jWYGJjnF80H7-9OdHlbtvRpBtS',
    ],
    updatedAt: now,
  },
  {
    _id: exerciseIds[3],
    name: 'Reject invitations',
    skill: 'communication',
    format: 'communication',
    topics: ['Everyday Conversation'],
    scenario: 'Reject invitations',
    learnerRole: 'participant',
    counterpartRole: 'friend',
    prompts: ['Do you fancy going for a pint later?'],
    validResponses: [
      'Sorry, I have plans tonight, but maybe another time?',
      "I'd love to, but i'm busy this evening",
      "That sounds fun, but i'm completely wrapped up with work",
      "I'm visiting my parents tonight, but how about next week?",
    ],
    userId,
    status: 'active',
    references: ['https://youtu.be/H-HVm6hRbsI?si=UwH6Z34fGJwlNQQW'],
    updatedAt: now,
  },
  {
    _id: exerciseIds[4],
    name: 'Practice Exaggeration',
    skill: 'communication',
    format: 'communication',
    topics: ['Everyday Conversation'],
    scenario: 'Exaggerate things',
    learnerRole: 'participant',
    counterpartRole: 'listener',
    prompts: ['Exaggerate something about yourself using the word "literally"'],
    validResponses: [
      "I'm literally starving!",
      "My head is literally exploding! I've done so much work today!",
    ],
    userId,
    status: 'active',
    references: ['https://www.youtube.com/watch?v=FinOIdu21XA'],
    updatedAt: now,
  },
];

// Vocabulary Exercises
const vocabularyExercises = [
  {
    _id: exerciseIds[5],
    name: 'customs',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'customs',
    meaning:
      'The official procedures and formalities required by a country when entering or leaving it (hải quan).',
    sentences: ["At customs, they're going to ask for your passport and stamp it."],
    clues: ['passport', 'inspection', 'border', 'declaration', 'immigration'],
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
  {
    _id: exerciseIds[6],
    name: 'security',
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
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
  {
    _id: exerciseIds[7],
    name: 'baggage claim',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'baggage claim',
    meaning:
      'The area in an airport where passengers collect their checked luggage after a flight (nhận hành lý).',
    sentences: ['After landing, head to baggage claim to pick up your suitcase.'],
    clues: ['luggage', 'carousel', 'claim ticket', 'lost and found', 'pickup'],
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
  {
    _id: exerciseIds[8],
    name: 'check-in counter',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'check-in counter',
    meaning:
      'The area in an airport where passengers go to check in for their flight and drop off their luggage (quầy làm thủ tục).',
    sentences: ['I need to go to the check-in counter to get my boarding pass.'],
    clues: ['check-in', 'boarding pass', 'luggage drop', 'queue', 'counter'],
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
  {
    _id: exerciseIds[9],
    name: 'self check-in',
    skill: 'vocabulary',
    format: 'word',
    topics: ['Airport', 'Travel'],
    word: 'self check-in',
    meaning:
      'The process where passengers check in for their flight and print their boarding passes using automated kiosks at the airport (tự làm thủ tục).',
    sentences: ['I prefer using the self check-in kiosks to save time.'],
    clues: ['kiosk', 'boarding pass', 'automated', 'self-service', 'queue'],
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
];

// Articulation Exercises
const articulationExercises = [
  {
    _id: exerciseIds[10],
    name: 'Describe your background',
    skill: 'articulation',
    format: 'sentence',
    topics: ['Job Interview', 'Software Engineering'],
    scenario: 'Describe your background',
    words: ['study', 'computer science', 'university', "bachelor's degree"],
    sentence:
      "I studied computer science at university and had a bachelor's degree.",
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
  {
    _id: exerciseIds[11],
    name: 'Describe work experiences',
    skill: 'articulation',
    format: 'sentence',
    topics: ['Job Interview', 'Software Engineering'],
    scenario: 'Describe work experiences',
    words: [
      'over / more than',
      '10 years',
      'software',
      'tech lead',
      'manage',
      'coding',
    ],
    sentence:
      "I have over 10 years of experience in software development. For the past 6 years, I've worked as a tech lead, managing development teams, and doing hands-on coding.",
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
  {
    _id: exerciseIds[12],
    name: 'Describe job expertise',
    skill: 'articulation',
    format: 'sentence',
    topics: ['Job Interview', 'Software Engineering'],
    scenario: 'Describe job expertise',
    words: [
      'web',
      'backend',
      'React',
      'Node.js',
      'TypeScript',
      'Cloud computing',
      'DevOps',
    ],
    sentence:
      'I specialize in web and backend development using React, Node.js, TypeScript, Python, Cloud computing, and DevOps, and I have experience with Cloud computing and DevOps practices.',
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
  {
    _id: exerciseIds[13],
    name: 'Mid-Autumn Festival Introduction',
    skill: 'articulation',
    format: 'paragraph',
    topics: ['Mid-Autumn Festival'],
    scenario: 'Mid-Autumn Festival Introduction',
    prompts: [
      'Read and practice the following paragraph about the Mid-Autumn Festival.',
    ],
    paragraph:
      'The Mid-Autumn Festival is a major Vietnamese celebration held on the 15th day of the eighth lunar month. Families gather to enjoy mooncakes and admire the full moon. Children take part in lantern parades and lion dances. The festival promotes family unity and preserves cultural traditions.',
    words: [
      'Mid-Autumn Festival',
      '15th day',
      'mooncakes',
      'lanterns',
      'lion dances',
      'full moon',
      'family reunion',
    ],
    userId,
    status: 'active',
    references: [],
    updatedAt: now,
  },
];

const exercises = [
  ...communicationExercises,
  ...vocabularyExercises,
  ...articulationExercises,
];

exercisesCol.insertMany(
  exercises.map((exercise) => ({
    ...exercise,
    createdAt: new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  })),
);

// Create practice records for all exercises
const practiceRecords = exerciseIds.map((exerciseId, index) => ({
  exerciseId,
  practiceCount: Math.floor(Math.random() * 5),
  practicedAt: index % 3 === 0 ? new Date('2026-08-10T09:00:00Z') : null,
  userId,
  createdAt: now,
  updatedAt: now,
}));

practicesCol.insertMany(practiceRecords);
