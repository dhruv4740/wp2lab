// Exp 6 + 8: main Express file (port 5000), like app.js in the handout. It sets up the middleware and
// mounts the modular routers: crewRoutes.js (Exp 6) and exp8-students/routes.js (Exp 8), plus a news route.
import express from 'express';
import cors from 'cors';
import { readFile } from 'node:fs/promises';
import studentRouter from '../exp8-students/routes.js';
import crewRouter from './crewRoutes.js';

const app = express();
// Middleware: cors lets the React dev server call this API; express.json parses JSON request bodies.
app.use(cors());
app.use(express.json());

// Mount each router under its URL prefix (Exp 6): /api/crew -> crewRoutes.js, /api/students -> exp8-students/routes.js.
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
