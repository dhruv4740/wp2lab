// Exp 8: read and query students (find with filters, sort, findOne by id).
import { ObjectId } from 'mongodb';
import { students } from '../db.js';

// Turn an id string into an ObjectId, or null if it is not valid (avoids a driver error).
export const toId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

// All students ordered by roll number.
export async function findAll() {
  return (await students()).find().sort({ rollNo: 1 }).toArray();
}

// One student by id, or null when the id is invalid or not found.
export async function findById(id) {
  const _id = toId(id);
  return _id ? (await students()).findOne({ _id }) : null;
}

// Query 1: students from a specific state
export async function findByState(state) {
  return (await students()).find({ state }).toArray();
}

// Query 2: students who joined in a given year (e.g. 2023)
export async function findByJoiningYear(year) {
  return (await students()).find({ joiningYear: Number(year) }).toArray();
}

// Query 3: students taking a specific subject
export async function findBySubject(subject) {
  return (await students()).find({ subjects: subject }).toArray();
}
