// Exp 4: loads the news feed from our Express API with axios and async/await, then lets the
// user filter it by search text and category (state-driven filtering).
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RefreshCw } from 'lucide-react';

const NEWS_API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/news';

const card = { padding: '1.5rem', backgroundColor: '#0a0e18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: '0.6rem' };
const mono = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem' };

export default function Dispatches() {
  // State: the articles, loading and error flags, request time, and the two filter inputs.
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latency, setLatency] = useState(0); // how long the last request took, in ms
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Async function: waits for the HTTP response, then stores it. try/catch handles request errors,
  // and finally always turns the loading flag off.
  const loadNews = async () => {
    setLoading(true);
    setError('');
    const start = performance.now();
    try {
      const response = await axios.get(NEWS_API); // axios: response.data is already parsed JSON
      setArticles(response.data.articles || []);
      setLatency(Math.round(performance.now() - start));
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  // Run once after the first render: load the feed when the page opens.
  useEffect(() => { loadNews(); }, []);

  // Category buttons: "All" plus each distinct category in the data (a Set removes duplicates).
  const categories = ['All', ...new Set(articles.map((a) => a.category))];

  // Filter: keep articles that match the chosen category and contain the search text in title or summary.
  const text = search.toLowerCase();
  const shown = articles.filter((a) =>
    (category === 'All' || a.category === category) &&
    (a.title.toLowerCase().includes(text) || a.summary.toLowerCase().includes(text))
  );

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>News</h1>
      <p style={{ color: '#94a3b8', maxWidth: 700, lineHeight: 1.6, marginBottom: '1.5rem' }}>
        Real space news from the free Spaceflight News API. Our Express server fetches it at GET /api/news and this page loads it with axios.
        If the internet is down, the server falls back to public/news.json.
      </p>

      {/* Request info and re-fetch button */}
      <div style={{ ...card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ ...mono, color: '#00e5ff' }}>GET {NEWS_API} · {loading ? 'loading…' : `${latency} ms`}</span>
        <button type="button" onClick={loadNews} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '0.4rem 0.8rem', borderRadius: 6, border: '1px solid #00e5ff', background: 'transparent', color: '#00e5ff', cursor: 'pointer' }}>
          <RefreshCw size={14} /> Re-fetch
        </button>
      </div>

      {/* Search box and category buttons (controlled inputs) */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news..." style={{ padding: '0.55rem 0.8rem 0.55rem 2rem', borderRadius: 8, border: '1px solid #334155', background: '#0a0e18', color: '#f0f2f5' }} />
        </div>
        {categories.map((c) => (
          <button key={c} type="button" onClick={() => setCategory(c)} style={{ padding: '0.4rem 0.8rem', borderRadius: 6, cursor: 'pointer', background: 'transparent', border: '1px solid ' + (category === c ? '#00e5ff' : '#334155'), color: category === c ? '#00e5ff' : '#94a3b8' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Conditional rendering: loading, error, or the list of articles */}
      {loading && <p style={{ color: '#94a3b8' }}>Loading news…</p>}
      {error && <p style={{ color: '#fb7185' }}>Could not load news: {error}. Start the API with npm run api.</p>}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {shown.map((a) => (
            <div key={a.id} style={card}>
              <div style={{ ...mono, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#00e5ff' }}>{a.category}</span>
                <span style={{ color: '#64748b' }}>{a.date}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>{a.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>{a.summary}</p>
              <a href={a.url} target="_blank" rel="noreferrer" style={{ ...mono, color: '#00e5ff', marginTop: 'auto' }}>READ ARTICLE →</a>
            </div>
          ))}
          {!shown.length && <p style={{ color: '#94a3b8' }}>No articles match.</p>}
        </div>
      )}
    </div>
  );
}
