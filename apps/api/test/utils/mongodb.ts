import { Db, MongoClient, ObjectId } from 'mongodb';

type PlainObject = Record<string, unknown>;

interface MongoDocument {
  _id: ObjectId;
  [key: string]: unknown;
}

const uri = process.env.DATABASE_URL;
const dbName = 'test';

let client: MongoClient | undefined;
let db: Db | undefined;

// CONNECT
async function connect(): Promise<void> {
  if (!client) {
    if (!uri) throw new Error('DATABASE_URL environment variable is not set');

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }
}

// DISCONNECT
async function disconnect(): Promise<void> {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}

// INSERT
async function insert(
  collectionName: string,
  data: PlainObject,
): Promise<MongoDocument> {
  if (!db) throw new Error('Not connected to database');
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(data);
  return { _id: result.insertedId, ...data };
}

// INSERT MANY
async function insertMany(
  collectionName: string,
  data: PlainObject[],
): Promise<string[]> {
  if (!db) throw new Error('Not connected to database');
  const collection = db.collection(collectionName);
  const result = await collection.insertMany(data);
  return Object.values(result.insertedIds).map((id) => id.toString());
}

// FIND ONE
async function findById(
  collectionName: string,
  id: string,
): Promise<MongoDocument | null> {
  if (!db) throw new Error('Not connected to database');
  const collection = db.collection(collectionName);
  return await collection.findOne({ _id: new ObjectId(id) });
}

// FIND ONE
async function findOne(
  collectionName: string,
  query: PlainObject = {},
): Promise<MongoDocument | null> {
  if (!db) throw new Error('Not connected to database');
  const collection = db.collection(collectionName);
  return await collection.findOne(query);
}

// FIND ONE OR FAIL
async function findOneOrFail(
  collectionName: string,
  query: PlainObject = {},
): Promise<MongoDocument> {
  if (!db) throw new Error('Not connected to database');

  const collection = db.collection(collectionName);
  const result = await collection.findOne(query);
  if (result) return result;

  throw new Error(`No record found in ${collectionName}`);
}

// FIND MANY
async function findAll(
  collectionName: string,
  query: PlainObject = {},
): Promise<MongoDocument[]> {
  if (!db) throw new Error('Not connected to database');
  const collection = db.collection(collectionName);
  return await collection.find(query).toArray();
}

// UPDATE
async function updateOne(
  collectionName: string,
  id: string,
  updates: PlainObject,
): Promise<MongoDocument | null> {
  if (!db) throw new Error('Not connected to database');
  const collection = db.collection(collectionName);
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates },
  );
  return result.modifiedCount ? { _id: new ObjectId(id), ...updates } : null;
}

// DELETE ONE
async function deleteOne(collectionName: string, id: string): Promise<boolean> {
  if (!db) throw new Error('Not connected to database');
  const collection = db.collection(collectionName);

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// DELETE MANY
async function deleteMany(
  collectionName: string,
  query: PlainObject,
): Promise<number> {
  if (!db) throw new Error('Not connected to database');
  const collection = db.collection(collectionName);

  const result = await collection.deleteMany(query);
  return result.deletedCount;
}

export {
  connect,
  deleteMany,
  deleteOne,
  disconnect,
  findAll,
  findById,
  findOne,
  findOneOrFail,
  insert,
  insertMany,
  updateOne,
};
