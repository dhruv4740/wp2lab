// Exp 6 + 8: Express server (port 5000). Mounts the REST routers for crew and students
// (backed by MongoDB, Exp 7) and a news route that proxies a public API.
import express, { Router } from 'express';
import cors from 'cors';
import { readFile } from 'node:fs/promises';
import studentRouter from '../exp8-students/routes.js';
import { addMember, findMembers, updateMember, deleteMember } from './crew.js';

const app = express();
// Middleware: cors lets the React dev server call this API; express.json parses JSON request bodies.
app.use(cors());
app.use(express.json());

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

// Mount the routers under their URL prefixes.
app.use('/api/crew', crewRouter);
app.use('/api/students', studentRouter);

// News: fetch real articles from the Spaceflight News API (free, no key) and map them
// to the shape the pages expect. Falls back to public/news.json when the upstream is unreachable.
const NEWS_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=8&search=satellite';

app.get('/api/news', async (req, res) => {
  try {
    // Give up after 8 seconds so a slow upstream does not hang the request.
    const r = await fetch(NEWS_URL, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error('upstream ' + r.status);
    const { results } = await r.json();
    const articles = results.map((a, i) => ({
      id: 'SFN-' + a.id,
      title: a.title,
      slug: String(a.id),
      category: a.news_site,
      date: a.published_at.slice(0, 10),
      author: a.authors?.[0]?.name || a.news_site,
      callsign: a.news_site,
      priority: i === 0 ? 'HIGH' : 'NORMAL',
      featured: i === 0,
      readTimeMinutes: 2,
      summary: a.summary,
      content: a.summary,
      tags: [a.news_site],
      url: a.url,
    }));
    res.json({ source: 'spaceflightnewsapi.net', live: true, lastUpdated: new Date().toISOString(), totalArticles: articles.length, articles });
  } catch {
    // Upstream failed: serve the saved copy and mark it as not live.
    const file = JSON.parse(await readFile(new URL('../../public/news.json', import.meta.url), 'utf8'));
    res.json({ ...file, source: 'public/news.json (fallback)', live: false });
  }
});

// Error-handling middleware (four arguments): any error thrown in a route ends up here as a 500 response.
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

const port = process.env.API_PORT || 5000;
app.listen(port, () => console.log(`Crew API on http://localhost:${port}`));
