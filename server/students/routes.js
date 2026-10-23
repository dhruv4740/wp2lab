// Exp 8: REST API for students (mounted at /api/students). Each route validates input,
// calls a database function (async), and replies with the proper status code.
import { Router } from 'express';
import { addStudent } from './add.js';
import { findAll, findById, findByState, findByJoiningYear, findBySubject } from './find.js';
import { updateStudent } from './update.js';
import { deleteStudent } from './delete.js';
import { markAttendance, attendancePercent } from './attendance.js';
import { addMarks } from './grades.js';
import { scholarshipList } from './scholarship.js';

const router = Router();
const REQUIRED = 'rollNo, name, branch, state, joiningYear and cgpa (0-10) are required';
// Convert the request body into a student record with proper types (numbers, trimmed text, subject list).
const fields = (b) => ({
  rollNo: Number(b.rollNo),
  name: String(b.name).trim(),
  branch: String(b.branch).trim(),
  state: String(b.state).trim(),
  joiningYear: Number(b.joiningYear),
  cgpa: Number(b.cgpa),
  subjects: Array.isArray(b.subjects) ? b.subjects : String(b.subjects || '').split(',').map((s) => s.trim()).filter(Boolean),
});
// Required fields must be present and CGPA must be between 0 and 10.
const valid = (b) =>
  b && String(b.name || '').trim() && b.branch && b.state && b.rollNo && b.joiningYear &&
  b.cgpa !== undefined && b.cgpa !== '' && Number(b.cgpa) >= 0 && Number(b.cgpa) <= 10;

// GET /api/students   all students, or filtered by ?state= / ?year= / ?subject=
router.get('/', async (req, res) => {
  const { state, year, subject } = req.query;
  if (state) return res.json(await findByState(state));
  if (year) return res.json(await findByJoiningYear(year));
  if (subject) return res.json(await findBySubject(subject));
  res.json(await findAll());
});

// Declared before '/:id' so the word "scholarship" is not treated as an id.
router.get('/scholarship', async (req, res) => res.json(await scholarshipList()));

// One student plus the computed attendance percentage; 404 when not found.
router.get('/:id', async (req, res) => {
  const s = await findById(req.params.id);
  if (!s) return res.status(404).json({ error: 'not found' });
  res.json({ ...s, attendancePercent: attendancePercent(s) });
});

// Create: respond 400 when fields are missing or invalid, otherwise 201 Created.
router.post('/', async (req, res) => {
  if (!valid(req.body)) return res.status(400).json({ error: REQUIRED });
  res.status(201).json(await addStudent(fields(req.body)));
});

// Update: 400 for invalid input, 404 when the id does not exist.
router.put('/:id', async (req, res) => {
  if (!valid(req.body)) return res.status(400).json({ error: REQUIRED });
  const s = await updateStudent(req.params.id, fields(req.body));
  if (!s) return res.status(404).json({ error: 'not found' });
  res.json(s);
});

// Delete: 404 when nothing was removed.
router.delete('/:id', async (req, res) => {
  if (!(await deleteStudent(req.params.id))) return res.status(404).json({ error: 'not found' });
  res.json({ deleted: true });
});

// Add one attendance entry to a student.
router.post('/:id/attendance', async (req, res) => {
  const { date, present } = req.body || {};
  if (!date) return res.status(400).json({ error: 'date is required' });
  const s = await markAttendance(req.params.id, date, present);
  if (!s) return res.status(404).json({ error: 'not found' });
  res.status(201).json({ ...s, attendancePercent: attendancePercent(s) });
});

// Add or replace marks for one subject; marks must be a number from 0 to 100.
router.post('/:id/grades', async (req, res) => {
  const { subject, marks } = req.body || {};
  if (!subject || marks === undefined || marks === '' || Number.isNaN(Number(marks)) || Number(marks) < 0 || Number(marks) > 100) {
    return res.status(400).json({ error: 'subject and marks (0-100) are required' });
  }
  const s = await addMarks(req.params.id, subject, marks);
  if (!s) return res.status(404).json({ error: 'not found' });
  res.status(201).json(s);
});

export default router;
