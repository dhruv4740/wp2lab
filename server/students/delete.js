import { students } from '../mongo/db.js';
import { toId } from './find.js';

export async function deleteStudent(id) {
  const _id = toId(id);
  if (!_id) return false;
  const { deletedCount } = await (await students()).deleteOne({ _id });
  return deletedCount === 1;
}
