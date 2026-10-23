import { ObjectId } from 'mongodb';
import { crew } from './db.js';

const toId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

export async function addMember({ name, branch }) {
  const doc = { name, branch, callsign: 'VU2-' + Math.floor(1000 + Math.random() * 9000), joinedAt: new Date() };
  const { insertedId } = await (await crew()).insertOne(doc);
  return { _id: insertedId, ...doc };
}

export async function findMembers() {
  return (await crew()).find().sort({ joinedAt: -1 }).toArray();
}

export async function updateMember(id, { name, branch }) {
  const _id = toId(id);
  if (!_id) return null;
  return (await crew()).findOneAndUpdate({ _id }, { $set: { name, branch } }, { returnDocument: 'after' });
}

export async function deleteMember(id) {
  const _id = toId(id);
  if (!_id) return false;
  const { deletedCount } = await (await crew()).deleteOne({ _id });
  return deletedCount === 1;
}
