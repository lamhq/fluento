// Connect to MongoDB and run this script to initialize the database

print('Initializing replica set...');
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }],
});

print('Creating collections...');
db = db.getSiblingDB('test');
db.createCollection('exercises');
db.createCollection('learner_exercise_practices');
db.createCollection('topics');
db.createCollection('users');

print('Seeding data...');
const exercisesCol = db.getCollection('exercises');
const practicesCol = db.getCollection('learner_exercise_practices');
const topicsCol = db.getCollection('topics');
const usersCol = db.getCollection('users');
const exerciseId1 = ObjectId('65f000000000000000000001');
const exerciseId2 = ObjectId('65f000000000000000000002');
const userId = ObjectId('65f000000000000000000003');
const now = new Date();

const topicNames = ['Restaurant', 'Socializing', 'Travel', 'School'];

exercisesCol.deleteMany({ _id: { $in: [exerciseId1, exerciseId2] } });
practicesCol.deleteMany({ exerciseId: { $in: [exerciseId1, exerciseId2] } });
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

exercisesCol.insertMany([
  {
    _id: exerciseId1,
    userId,
    status: 'active',
    topics: ['Restaurant'],
    scenario: 'Ordering coffee at a cafe',
    learnerRole: 'customer',
    counterpartRole: 'barista',
    prompts: ['Good morning! What can I get for you?'],
    expectedResponses: [
      { content: 'Can I get a medium latte, please?', style: ['polite'] },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseId2,
    userId,
    status: 'archived',
    topics: ['Socializing'],
    scenario: 'Making small talk with a coworker',
    learnerRole: 'employee',
    counterpartRole: 'coworker',
    prompts: ['How was your weekend?'],
    expectedResponses: [
      { content: 'It was great, thanks! I went hiking.', style: ['casual'] },
    ],
    createdAt: now,
    updatedAt: now,
  },
]);

practicesCol.insertMany([
  {
    learnerId: userId,
    exerciseId: exerciseId1,
    practiceCount: 3,
    lastPracticeAt: new Date('2026-08-10T09:00:00Z'),
    createdAt: now,
    updatedAt: now,
  },
  {
    learnerId: userId,
    exerciseId: exerciseId2,
    practiceCount: 0,
    lastPracticeAt: null,
    createdAt: now,
    updatedAt: now,
  },
]);

print('Seed complete');
