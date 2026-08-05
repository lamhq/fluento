// Connect to MongoDB and run this script to initialize the database

print('Initializing replica set...');
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }],
});

print('Creating collections...');
db = db.getSiblingDB('test');
db.createCollection('exercises');

print('Done.');
