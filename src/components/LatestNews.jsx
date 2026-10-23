import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Latest 3 headlines from GET /api/news (live Spaceflight News, static file when offline).
export default function LatestNews() {
  const [news, setNews] = useState(null);
  const [error, setError] = useState(false);

  // Exp 4: after the first render, request the news and store it in state; show an error if it fails.
  useEffect(() => {
    fetch(`${API}/news`)
      .then((r) => r.json())
      .then(setNews)
      .catch(() => setError(true));
  }, []);

  return (
    <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Latest space news</h2>
        <Link to="/news" style={{ color: '#00e5ff', fontSize: '0.9rem' }}>All news →</Link>
      </div>
      {error && <p style={{ color: '#f87171' }}>News API is offline. Start it with npm run api.</p>}
      {!news && !error && <p style={{ color: '#64748b' }}>Loading…</p>}
      {news && (
        <>
          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {news.articles.slice(0, 3).map((a) => (
              <a key={a.id} href={a.url || '/news'} target={a.url ? '_blank' : undefined} rel="noreferrer" style={{ textDecoration: 'none', color: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,14,24,0.75)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64748b' }}>{a.category} · {a.date}</div>
                <div style={{ marginTop: 4 }}>{a.title}</div>
              </a>
            ))}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 8 }}>{news.live ? 'LIVE' : 'OFFLINE COPY'} · Source: {news.source}. Free Spaceflight News API (api.spaceflightnewsapi.net), no key, fetched by our Express server at GET /api/news and reshaped for this site. Browser → :5000/api/news → Spaceflight News.</p>
        </>
      )}
    </section>
  );
}
