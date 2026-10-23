import express, { Router } from 'express';
import cors from 'cors';
import { readFile } from 'node:fs/promises';
import studentRouter from '../students/routes.js';
import { addMember, findMembers, updateMember, deleteMember } from './crew.js';

const app = express();
app.use(cors());
app.use(express.json());

const valid = (b) => b && typeof b.name === 'string' && b.name.trim() && typeof b.branch === 'string' && b.branch.trim();
const clean = (b) => ({ name: b.name.trim(), branch: b.branch.trim() });

const crewRouter = Router();

crewRouter.get('/', async (req, res) => res.json(await findMembers()));

crewRouter.post('/', async (req, res) => {
  if (!valid(req.body)) return res.status(400).json({ error: 'name and branch are required' });
  res.status(201).json(await addMember(clean(req.body)));
});

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


app.use('/api/crew', crewRouter);
app.use('/api/students', studentRouter);

// Real news: Spaceflight News API (free, no key), mapped to the shape the pages expect.
// Falls back to public/news.json when the upstream is unreachable.
const NEWS_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=8&search=satellite';

app.get('/api/news', async (req, res) => {
  try {
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
    const file = JSON.parse(await readFile(new URL('../../public/news.json', import.meta.url), 'utf8'));
    res.json({ ...file, source: 'public/news.json (fallback)', live: false });
  }
});

app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

const port = process.env.API_PORT || 5000;
app.listen(port, () => console.log(`Crew API on http://localhost:${port}`));
