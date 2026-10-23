import { MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DB || 'somaiyasat';

let client;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

export const crew = async () => (await connectDB()).collection('crew');

export async function closeDB() {
  if (client) await client.close();
  client = undefined;
}

export const students = async () => (await connectDB()).collection('students');
