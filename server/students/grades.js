import { students } from '../mongo/db.js';
import { toId } from './find.js';

// Add (or overwrite) the marks for one subject.
export async function addMarks(id, subject, marks) {
  const _id = toId(id);
  if (!_id) return null;
  const col = await students();
  await col.updateOne({ _id }, { $pull: { grades: { subject } } });
  return col.findOneAndUpdate({ _id }, { $push: { grades: { subject, marks: Number(marks) } } }, { returnDocument: 'after' });
}
