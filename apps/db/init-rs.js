// Intialize the replica set
print('Initializing replica set...');
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }],
});

// Create collections
db = db.getSiblingDB('test');
db.createCollection('exercises');
