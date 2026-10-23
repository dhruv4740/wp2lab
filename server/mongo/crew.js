// Exp 7: CRUD functions for the crew collection (insert, find, update, delete).
// Each function is async (it returns a Promise), so callers must wait for the result.
import { ObjectId } from 'mongodb';
import { crew } from './db.js';

// Convert the id string from the URL into an ObjectId, or null when it is not a valid id.
const toId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

// Create: add a member with a generated callsign and join time.
export async function addMember({ name, branch }) {
  const doc = { name, branch, callsign: 'VU2-' + Math.floor(1000 + Math.random() * 9000), joinedAt: new Date() };
  const { insertedId } = await (await crew()).insertOne(doc);
  return { _id: insertedId, ...doc };
}

// Read: all members, newest first.
export async function findMembers() {
  return (await crew()).find().sort({ joinedAt: -1 }).toArray();
}

// Update: change name and branch; returns the updated document, or null if the id is not found.
export async function updateMember(id, { name, branch }) {
  const _id = toId(id);
  if (!_id) return null;
  return (await crew()).findOneAndUpdate({ _id }, { $set: { name, branch } }, { returnDocument: 'after' });
}

// Delete: returns true only when exactly one document was removed.
export async function deleteMember(id) {
  const _id = toId(id);
  if (!_id) return false;
  const { deletedCount } = await (await crew()).deleteOne({ _id });
  return deletedCount === 1;
}
