import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Search, 
  RefreshCw, 
  Clock, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ChevronRight, 
  Tag, 
  Activity, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Filter,
  X,
  Copy,
  Check
} from 'lucide-react';

const NEWS_API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/news';

export default function NewsFeed() {
  // State for fetched articles & metadata
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering & Interaction state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);
  const [showApiInspector, setShowApiInspector] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Network Telemetry state for API Inspector
  const [apiMetrics, setApiMetrics] = useState({
    url: NEWS_API,
    method: 'GET',
    status: null,
    statusText: '',
    durationMs: 0,
    payloadSizeBytes: 0,
    timestamp: null
  });

  // Fetch API Method Implementation
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      // Native JavaScript Fetch API Call
      const response = await fetch(NEWS_API, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText || 'Failed to fetch mission news'}`);
      }

      // Parsing JSON response using response.json()
      const jsonData = await response.json();
      const rawText = JSON.stringify(jsonData);

      setData(jsonData);
      setApiMetrics({
        url: NEWS_API,
        method: 'GET',
        status: response.status,
        statusText: response.statusText || 'OK',
        durationMs: duration,
        payloadSizeBytes: new Blob([rawText]).size,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error('Fetch API Error:', err);
      setError(err.message || 'An error occurred while fetching orbital news.');
      setApiMetrics(prev => ({
        ...prev,
        status: 500,
        statusText: 'Fetch Error',
        timestamp: new Date().toLocaleTimeString()
      }));
    } finally {
      setLoading(false);
    }
  };

  // Trigger Fetch on Initial Component Mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Filter logic
  const articles = data?.articles || [];
  const categories = ['All', ...new Set(articles.map(a => a.category))];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find(a => a.featured) || filteredArticles[0];
  const regularArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  const copyRawJson = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', color: '#f8fafc', minHeight: '100vh', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header / Mission Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                backgroundColor: 'rgba(56, 189, 248, 0.12)', 
                color: '#38bdf8', 
                padding: '0.25rem 0.65rem', 
                borderRadius: '6px', 
                fontSize: '0.75rem', 
                fontWeight: '600', 
                fontFamily: 'JetBrains Mono, monospace', 
                border: '1px solid rgba(255, 255, 255, 0.08)' 
              }}>
                <Radio size={13} className="animate-pulse" /> LIVE TELEMETRY WIRE
              </span>
              <span style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>
                FETCH API &bull; REST GET /api/news
              </span>
            </div>
            <h1 style={{ fontSize: '2.3rem', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Mission Dispatches &amp; <span style={{ color: '#38bdf8' }}>Orbital News</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, maxWidth: '680px', lineHeight: '1.6' }}>
              Real-time engineering bulletins, deployment telemetry qualifications, AI scheduler verification logs, and global amateur radio payload announcements fetched dynamically via the Fetch API.
            </p>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowApiInspector(!showApiInspector)}
              style={{
                backgroundColor: showApiInspector ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: showApiInspector ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                color: showApiInspector ? '#38bdf8' : '#cbd5e1',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Terminal size={16} />
              {showApiInspector ? 'Hide API Inspector' : 'Inspect Fetch API'}
            </button>

            <button
              onClick={fetchNews}
              disabled={loading}
              style={{
                backgroundColor: '#00f0ff',
                color: '#04060a',
                border: 'none',
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1
              }}
            >
              <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Fetching Wire...' : 'Refresh Wire'}
            </button>
          </div>
        </div>

        {/* Live API Inspector Drawer */}
        {showApiInspector && (
          <div style={{
            backgroundColor: '#04060a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(56, 189, 248, 0.15)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={18} color="#38bdf8" />
                <span style={{ fontWeight: '700', fontSize: '0.92rem', fontFamily: 'JetBrains Mono, monospace', color: '#f8fafc' }}>
                  FETCH API NETWORK TELEMETRY
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={copyRawJson}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94a3b8',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedJson ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                  {copiedJson ? 'Copied JSON' : 'Copy JSON'}
                </button>
                <button 
                  onClick={() => setShowApiInspector(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* HTTP Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Method &amp; URI</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>
                  <span style={{ color: '#34d399' }}>GET</span> {apiMetrics.url}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>HTTP Status</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: apiMetrics.status === 200 ? '#34d399' : '#ef4444', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>
                  {apiMetrics.status ? `${apiMetrics.status} ${apiMetrics.statusText}` : 'Pending...'}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Roundtrip Latency</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#a855f7', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>
                  {apiMetrics.durationMs} ms
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Payload Size</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>
                  {(apiMetrics.payloadSizeBytes / 1024).toFixed(2)} KB ({apiMetrics.payloadSizeBytes} B)
                </div>
              </div>
            </div>

            {/* Code Snippet Demonstration */}
            <div style={{
              backgroundColor: '#030712',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.78rem',
              color: '#94a3b8',
              overflowX: 'auto'
            }}>
              <span style={{ color: '#64748b' }}>// Implementation: Fetch API integration with async/await</span><br />
              <span style={{ color: '#a855f7' }}>const</span> response = <span style={{ color: '#a855f7' }}>await</span> <span style={{ color: '#38bdf8' }}>fetch</span>(<span style={{ color: '#34d399' }}>'/api/news'</span>);<br />
              <span style={{ color: '#a855f7' }}>const</span> jsonData = <span style={{ color: '#a855f7' }}>await</span> response.<span style={{ color: '#38bdf8' }}>json</span>(); <span style={{ color: '#64748b' }}>// Parsed {data?.totalArticles || 0} mission articles</span>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div style={{
          backgroundColor: '#0c111e',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Category Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
              <Filter size={14} /> Category:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedCategory === cat ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedCategory === cat ? '#38bdf8' : '#94a3b8',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: selectedCategory === cat ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search dispatches, tags, callsign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 2rem',
            backgroundColor: '#0c111e',
            borderRadius: '12px',
            border: '1px dashed rgba(56, 189, 248, 0.25)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '3px solid rgba(56, 189, 248, 0.15)',
              borderTopColor: '#38bdf8',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.25rem'
            }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', fontFamily: 'Space Grotesk, sans-serif' }}>
              Executing Fetch API Request...
            </div>
            <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', marginTop: '0.35rem' }}>
              GET /api/news &bull; Awaiting Promise Resolution
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <AlertCircle size={40} color="#f87171" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#f87171', margin: '0 0 0.5rem 0' }}>Fetch API Request Failed</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
              {error}
            </p>
            <button
              onClick={fetchNews}
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry Uplink Request
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div style={{
            backgroundColor: '#0c111e',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <Newspaper size={44} color="#64748b" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>No Dispatches Matched Criteria</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
              Try adjusting your search query or reset category filter.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              style={{
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#38bdf8',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ARTICLES CONTENT */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Featured Article Banner */}
            {featuredArticle && selectedCategory === 'All' && !searchQuery && (
              <div 
                style={{
                  backgroundColor: '#080b12',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    letterSpacing: '0.08em',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {featuredArticle.priority} BULLETIN
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {featuredArticle.category}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    {featuredArticle.id} &bull; {featuredArticle.date}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.65rem', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', color: '#ffffff', margin: '0 0 0.85rem 0', lineHeight: '1.3' }}>
                  {featuredArticle.title}
                </h2>

                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.65', margin: '0 0 1.5rem 0', maxWidth: '900px' }}>
                  {featuredArticle.summary}
                </p>

                {/* Subsystem Metrics Row */}
                {featuredArticle.metrics && (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {Object.entries(featuredArticle.metrics).map(([key, val]) => (
                      <div key={key} style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}>
                        <span style={{ color: '#94a3b8', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}: </span>
                        <strong style={{ color: '#34d399', fontFamily: 'JetBrains Mono, monospace' }}>{val}</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontWeight: '700', fontSize: '0.8rem' }}>
                      {featuredArticle.callsign.substring(0, 3)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#f8fafc' }}>{featuredArticle.author}</div>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>{featuredArticle.callsign}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveArticle(featuredArticle)}
                    style={{
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#38bdf8',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Read Full Dispatch <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {selectedCategory === 'All' && !searchQuery ? 'Recent Mission Bulletins' : `Dispatches (${filteredArticles.length})`}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                  DATA SOURCE: Spaceflight News API via /api/news
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
                {(selectedCategory === 'All' && !searchQuery ? regularArticles : filteredArticles).map(article => (
                  <div
                    key={article.id}
                    style={{
                      backgroundColor: '#0c111e',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div>
                      {/* Badge & Date */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.1)',
                          color: '#38bdf8',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                          {article.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                          {article.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.65rem 0', lineHeight: '1.4' }}>
                        {article.title}
                      </h4>

                      {/* Summary */}
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.55', margin: '0 0 1.25rem 0' }}>
                        {article.summary}
                      </p>
                    </div>

                    <div>
                      {/* Tags */}
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ fontSize: '0.68rem', color: '#64748b', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer Info */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.85rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                          {article.callsign}
                        </div>
                        <button
                          onClick={() => setActiveArticle(article)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#38bdf8',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '0.2rem 0'
                          }}
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ARTICLE DETAIL MODAL */}
      {activeArticle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#0a0f1d',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)'
          }}>
            <button
              onClick={() => setActiveArticle(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94a3b8',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <span style={{
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {activeArticle.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                {activeArticle.id} &bull; {activeArticle.date}
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', color: '#ffffff', margin: '0 0 1rem 0', lineHeight: '1.35' }}>
              {activeArticle.title}
            </h2>

            {/* Author Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '700', fontSize: '0.85rem' }}>
                {activeArticle.callsign.substring(0, 3)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>{activeArticle.author}</div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>Callsign: {activeArticle.callsign} &bull; Est. Read: {activeArticle.readTimeMinutes} min</div>
              </div>
            </div>

            {/* Full Body Content */}
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 1.25rem 0', fontWeight: '500', color: '#e2e8f0' }}>
                {activeArticle.summary}
              </p>
              <p style={{ margin: 0 }}>
                {activeArticle.content}
              </p>
            </div>

            {/* Subsystem Metrics Card if available */}
            {activeArticle.metrics && (
              <div style={{ backgroundColor: '#040711', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  TELEMETRY QUALIFICATION METRICS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  {Object.entries(activeArticle.metrics).map(([key, val]) => (
                    <div key={key} style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#34d399', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {activeArticle.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.72rem', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setActiveArticle(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
