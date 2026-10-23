// Exp 4: loads the news feed from our Express API with axios and async/await, then lets the
// user filter it by search text and category (state-driven filtering, Exp 3).
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';

const NEWS_API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/news';

export default function Dispatches() {
  // State: the API response, a loading flag, an error message, and the two filter inputs.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Details of the last request (URL, status, time taken) shown in the banner.
  const [apiMetrics, setApiMetrics] = useState({
    url: NEWS_API,
    method: 'GET',
    status: null,
    durationMs: 0,
    timestamp: null,
  });

  // Async function: waits for the HTTP response, then stores it. try/catch handles request errors,
  // and finally always turns the loading flag off.
  const fetchDispatches = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      const response = await axios.get(NEWS_API); // axios: response.data is already parsed JSON

      const end = performance.now();
      const duration = Math.round(end - start);

      const json = response.data;
      setData(json);
      setApiMetrics({
        url: NEWS_API,
        method: 'GET',
        status: response.status,
        durationMs: duration,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setError((err.response ? 'HTTP status ' + err.response.status + ': ' : '') + (err.message || 'Request failed'));
    } finally {
      setLoading(false);
    }
  };

  // Run once after the first render: load the feed when the page opens.
  useEffect(() => {
    fetchDispatches();
  }, []);

  const articles = data?.articles || [];
  // Category buttons: "All" plus each distinct category in the data (a Set removes duplicates).
  const categories = ['All', ...new Set(articles.map((a) => a.category))];

  // Filter: keep articles that match the chosen category and contain the search text in title or summary.
  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', color: '#00e5ff', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          LIVE NEWS
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', color: '#f0f2f5', marginBottom: '0.5rem' }}>
          MISSION DISPATCHES &amp; ORBITAL WIRE
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '800px', lineHeight: 1.6 }}>
          Real space news from the free Spaceflight News API (api.spaceflightnewsapi.net, no key). Our Express server fetches it at GET /api/news, reshapes it, and this page loads it with axios. If the internet or the API is down, it falls back to public/news.json.
        </p>
      </div>

      {/* Network Metrics Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#0a0e18',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          <span style={{ color: '#00e5ff', fontWeight: 700 }}>ENDPOINT: {apiMetrics.url}</span>
          <span style={{ color: '#10b981' }}>STATUS: {apiMetrics.status ? apiMetrics.status + ' OK' : 'CONNECTING...'}</span>
          <span style={{ color: '#94a3b8' }}>LATENCY: {apiMetrics.durationMs} ms</span>
        </div>
        <button
          type="button"
          onClick={fetchDispatches}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '6px',
            color: '#00e5ff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} className={loading ? 'pulse-beacon' : ''} />
          <span>RE-FETCH FEED</span>
        </button>
      </div>

      {/* Controls Bar: Search & Categories */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dispatches & telemetry..."
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.2rem',
              backgroundColor: '#0a0e18',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#f0f2f5',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.85rem',
                backgroundColor: selectedCategory === cat ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                border: selectedCategory === cat ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedCategory === cat ? '#00e5ff' : '#94a3b8',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-panel" style={{ padding: '2rem', height: '220px', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.6 }}>
              <div style={{ width: '40%', height: '14px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} className="pulse-beacon" />
              <div style={{ width: '85%', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
              <div style={{ width: '100%', height: '50px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px', color: '#fb7185', textAlign: 'center' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 0.75rem' }} />
          <h3>Network Communication Failure</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '1.75rem',
                backgroundColor: '#0a0e18',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00e5ff', backgroundColor: 'rgba(0, 229, 255, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {art.category}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64748b' }}>
                    {art.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#f0f2f5', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  {art.title}
                </h3>

                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {art.summary}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>
                  BY {art.author || 'MISSION OPS'}
                </span>
                {/* Opens the original article in a new tab */}
                <a
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    background: 'transparent',
                    border: 'none',
                    color: '#00e5ff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>READ DISPATCH</span>
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
