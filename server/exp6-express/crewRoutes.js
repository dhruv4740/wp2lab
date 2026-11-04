// Exp 6: the crew router, one module of the application (like users.js / products.js in the handout).
// api.js mounts it at /api/crew. Express Router = a mini-app with its own middleware and routes.
import { Router } from 'express';
import { addMember, findMembers, updateMember, deleteMember } from './crew.js';

// Validation helpers: a body is valid when name and branch are non-empty strings.
const valid = (b) => b && typeof b.name === 'string' && b.name.trim() && typeof b.branch === 'string' && b.branch.trim();
const clean = (b) => ({ name: b.name.trim(), branch: b.branch.trim() });

// Crew REST API (mounted at /api/crew): GET list, POST create, PUT update, DELETE remove.
const crewRouter = Router();

// Router-level middleware (Exp 6): runs only for /api/crew requests. next() passes control to the matching route.
crewRouter.use((req, res, next) => {
  console.log('Crew request received at:', Date.now(), req.method, req.url);
  next();
});

// Async handler: the reply is sent only after the database has answered.
crewRouter.get('/', async (req, res) => res.json(await findMembers()));

// Respond 400 when required fields are missing, otherwise 201 Created with the new member.
crewRouter.post('/', async (req, res) => {
  if (!valid(req.body)) return res.status(400).json({ error: 'name and branch are required' });
  res.status(201).json(await addMember(clean(req.body)));
});

// :id is a route parameter (req.params.id). Respond 404 when no member has that id.
crewRouter.put('/:id', async (req, res) => {
  if (!valid(req.body)) return res.status(400).json({ error: 'name and branch are required' });
  const updated = await updateMember(req.params.id, clean(req.body));
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
});

crewRouter.delete('/:id', async (req, res) => {
  if (!(await deleteMember(req.params.id))) return res.status(404).json({ error: 'not found' });
  res.json({ deleted: true });
});

export default crewRouter;
