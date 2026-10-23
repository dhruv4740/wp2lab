import { students } from '../mongo/db.js';
import { toId } from './find.js';

// Record one day of attendance for a student.
export async function markAttendance(id, date, present) {
  const _id = toId(id);
  if (!_id) return null;
  return (await students()).findOneAndUpdate(
    { _id },
    { $push: { attendance: { date, present: !!present } } },
    { returnDocument: 'after' },
  );
}

export function attendancePercent(student) {
  const days = student.attendance || [];
  if (!days.length) return 0;
  return Math.round((days.filter((d) => d.present).length / days.length) * 100);
}
