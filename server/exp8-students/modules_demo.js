// Experiment 8, step 2-4: exercise each Node module against MongoDB (no HTTP).
// Run: node server/exp8-students/modules_demo.js
import { closeDB } from '../db.js';
import { seed } from './seed.js';
import { addStudent } from './add.js';
import { findAll, findByState, findByJoiningYear, findBySubject } from './find.js';
import { updateStudent } from './update.js';
import { deleteStudent } from './delete.js';
import { markAttendance, attendancePercent } from './attendance.js';
import { addMarks } from './grades.js';
import { scholarshipList } from './scholarship.js';

const line = (s) => console.log(`\n=== ${s} ===`);
const row = (s) => `${s.rollNo}  ${s.name.padEnd(15)} ${s.branch.padEnd(11)} ${s.state.padEnd(12)} ${s.joiningYear}  CGPA ${s.cgpa}`;

try {
  line('Seed: 10 students');
  console.log(`Inserted ${await seed()} students`);
  (await findAll()).forEach((s) => console.log(row(s)));

  line('add.js: addStudent');
  const added = await addStudent({ rollNo: 16010424011, name: 'Test Student', branch: 'IT', state: 'Goa', joiningYear: 2024, cgpa: 8.0, subjects: ['WP-II'] });
  console.log('Added:', added.name, added._id.toString());

  line('update.js: updateStudent (cgpa 8.0 -> 9.3)');
  const upd = await updateStudent(added._id.toString(), { cgpa: 9.3 });
  console.log('Updated:', upd.name, 'CGPA', upd.cgpa);

  line('attendance.js: markAttendance');
  await markAttendance(added._id.toString(), '2026-10-20', true);
  await markAttendance(added._id.toString(), '2026-10-21', true);
  const att = await markAttendance(added._id.toString(), '2026-10-22', false);
  console.log('Attendance:', att.attendance.map((d) => `${d.date}:${d.present ? 'P' : 'A'}`).join('  '), '=>', attendancePercent(att) + '%');

  line('grades.js: addMarks');
  await addMarks(added._id.toString(), 'WP-II', 88);
  const gr = await addMarks(added._id.toString(), 'DBMS', 76);
  console.log('Grades:', gr.grades);

  line('delete.js: deleteStudent');
  console.log('Deleted:', await deleteStudent(added._id.toString()));

  line('scholarship.js: CGPA > 9');
  (await scholarshipList()).forEach((s) => console.log(row(s)));

  line('Query 1: students from Maharashtra');
  (await findByState('Maharashtra')).forEach((s) => console.log(row(s)));

  line('Query 2: students who joined in 2023');
  (await findByJoiningYear(2023)).forEach((s) => console.log(row(s)));

  line('Query 3: students taking WP-II');
  (await findBySubject('WP-II')).forEach((s) => console.log(row(s)));
} finally {
  await closeDB();
}
