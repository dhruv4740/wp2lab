// Exp 8 (step 2): insert students into MongoDB. New students start with empty attendance and grades.
import { students } from '../db.js';

// Insert one student and return it with its new _id.
export async function addStudent(s) {
  const doc = { attendance: [], grades: [], ...s, createdAt: new Date() };
  const { insertedId } = await (await students()).insertOne(doc);
  return { _id: insertedId, ...doc };
}

// Insert many students in one call (used by the seed script); returns how many were added.
export async function addStudents(list) {
  const docs = list.map((s) => ({ attendance: [], grades: [], ...s, createdAt: new Date() }));
  const { insertedCount } = await (await students()).insertMany(docs);
  return insertedCount;
}
