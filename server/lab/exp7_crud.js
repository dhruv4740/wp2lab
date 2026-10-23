// Experiment 7: CRUD on MongoDB using the Node.js native driver.
// Run: node server/lab/exp7_crud.js   (MongoDB must be running on localhost:27017)
import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/company';

async function main() {
  const client = new MongoClient(uri);
  try {
    // Program 1: connect, create database and collection
    await client.connect();
    console.log('Connected Successfully');
    const db = client.db('company');
    const collection = db.collection('Employee');
    await collection.deleteMany({});
    await collection.insertOne({ name: 'Admin' });
    console.log('Database Created');

    // Program 2: insert a document
    const doc = { name: 'Raj', age: 24, city: 'Noida', salary: 40000, technology: ['C', 'C++', 'Java'] };
    const inserted = await collection.insertOne(doc);
    console.log('Document inserted successfully');
    console.log('Inserted ID:', inserted.insertedId.toString());

    // Program 3: read documents
    console.log('\nRead:');
    console.log(await collection.find({ name: 'Raj' }).toArray());

    // Program 4: update a document
    const filter = { name: 'Raj' };
    const updateDoc = { $set: { city: 'Mumbai', salary: 50000 } };
    const upd = await collection.updateOne(filter, updateDoc);
    console.log(`\n${upd.matchedCount} document matched.`);
    console.log(`${upd.modifiedCount} document modified.`);
    console.log(await collection.findOne(filter));

    // Program 5: delete a document
    const del = await collection.deleteOne(filter);
    console.log(del.deletedCount === 1 ? '\nSuccessfully deleted one document.' : '\nNo document deleted.');
    console.log('Remaining documents:', await collection.countDocuments());
  } finally {
    await client.close(); // Step 11: close the connection
  }
}

main().catch((err) => {
  console.error('Experiment 7 failed:', err.message);
  process.exit(1);
});
