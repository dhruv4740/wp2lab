// Exp 8: update a student. $set changes only the given fields; the updated document is returned.
import { students } from '../db.js';
import { toId } from './find.js';

export async function updateStudent(id, fields) {
  const _id = toId(id);
  if (!_id) return null;
  return (await students()).findOneAndUpdate({ _id }, { $set: fields }, { returnDocument: 'after' });
}
