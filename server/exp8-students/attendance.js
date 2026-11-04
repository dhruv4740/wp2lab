// Exp 8: attendance stored as an array inside each student document.
import { students } from '../db.js';
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

// Percentage of days marked present, rounded; 0 when no days are recorded.
export function attendancePercent(student) {
  const days = student.attendance || [];
  if (!days.length) return 0;
  return Math.round((days.filter((d) => d.present).length / days.length) * 100);
}
