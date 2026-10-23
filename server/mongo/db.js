// Exp 7: MongoDB connection helper. One shared client is created on first use and reused,
// so every route talks to the same database connection.
import { MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DB || 'somaiyasat';

let client;

// Connect once, then hand back the database; later calls reuse the same client.
export async function connectDB() {
  if (!client) {
    client = new MongoClient(URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

// Collection shortcuts: each one waits for the connection, then returns that collection.
export const crew = async () => (await connectDB()).collection('crew');

export async function closeDB() {
  if (client) await client.close();
  client = undefined;
}

export const students = async () => (await connectDB()).collection('students');
