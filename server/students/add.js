import { students } from '../mongo/db.js';

export async function addStudent(s) {
  const doc = { attendance: [], grades: [], ...s, createdAt: new Date() };
  const { insertedId } = await (await students()).insertOne(doc);
  return { _id: insertedId, ...doc };
}

export async function addStudents(list) {
  const docs = list.map((s) => ({ attendance: [], grades: [], ...s, createdAt: new Date() }));
  const { insertedCount } = await (await students()).insertMany(docs);
  return insertedCount;
}
