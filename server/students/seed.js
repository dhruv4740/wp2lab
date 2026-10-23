// Exp 8: sample data. Run with: node server/students/seed.js (replaces all students with 10 records).
import { students, closeDB } from '../mongo/db.js';
import { addStudents } from './add.js';

export const SAMPLE = [
  { rollNo: 16010424001, name: 'Aarav Mehta',    branch: 'Computer',    state: 'Maharashtra', joiningYear: 2023, cgpa: 9.4, subjects: ['WP-II', 'DBMS', 'OS'] },
  { rollNo: 16010424002, name: 'Diya Shah',      branch: 'IT',          state: 'Gujarat',     joiningYear: 2022, cgpa: 8.7, subjects: ['WP-II', 'CN', 'AI'] },
  { rollNo: 16010424003, name: 'Rohan Iyer',     branch: 'Electronics', state: 'Tamil Nadu',  joiningYear: 2023, cgpa: 7.9, subjects: ['DSP', 'VLSI', 'CN'] },
  { rollNo: 16010424004, name: 'Sneha Kulkarni', branch: 'Computer',    state: 'Maharashtra', joiningYear: 2021, cgpa: 9.1, subjects: ['AI', 'DBMS', 'WP-II'] },
  { rollNo: 16010424005, name: 'Kabir Singh',    branch: 'Mechanical',  state: 'Punjab',      joiningYear: 2023, cgpa: 6.8, subjects: ['Thermo', 'CAD', 'OS'] },
  { rollNo: 16010424006, name: 'Ananya Nair',    branch: 'IT',          state: 'Kerala',      joiningYear: 2022, cgpa: 9.6, subjects: ['WP-II', 'ML', 'DBMS'] },
  { rollNo: 16010424007, name: 'Vikram Rao',     branch: 'Electronics', state: 'Karnataka',   joiningYear: 2021, cgpa: 8.2, subjects: ['VLSI', 'DSP', 'AI'] },
  { rollNo: 16010424008, name: 'Meera Joshi',    branch: 'Computer',    state: 'Maharashtra', joiningYear: 2023, cgpa: 8.9, subjects: ['WP-II', 'CN', 'ML'] },
  { rollNo: 16010424009, name: 'Arjun Verma',    branch: 'Mechanical',  state: 'Rajasthan',   joiningYear: 2022, cgpa: 7.4, subjects: ['CAD', 'Thermo', 'DBMS'] },
  { rollNo: 16010424010, name: 'Ishita Bansal',  branch: 'IT',          state: 'Delhi',       joiningYear: 2023, cgpa: 9.2, subjects: ['WP-II', 'AI', 'CN'] },
];

// Clear the collection, then insert the sample students.
export async function seed() {
  await (await students()).deleteMany({});
  return addStudents(SAMPLE);
}

// Run the seed only when this file is executed directly, not when it is imported.
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  console.log(`Seeded ${await seed()} students`);
  await closeDB();
}
