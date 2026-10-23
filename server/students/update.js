import { students } from '../mongo/db.js';
import { toId } from './find.js';

export async function updateStudent(id, fields) {
  const _id = toId(id);
  if (!_id) return null;
  return (await students()).findOneAndUpdate({ _id }, { $set: fields }, { returnDocument: 'after' });
}
