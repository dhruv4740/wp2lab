// Exp 8: delete a student by id.
import { students } from '../db.js';
import { toId } from './find.js';

// Returns true only when exactly one document was removed.
export async function deleteStudent(id) {
  const _id = toId(id);
  if (!_id) return false;
  const { deletedCount } = await (await students()).deleteOne({ _id });
  return deletedCount === 1;
}
