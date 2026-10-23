// Exp 3 + routing: a contact form with a controlled textarea. After submit it redirects to the
// home page from code, using the navigate function from React Router.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, Send, Home, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  // Ignore empty messages; otherwise show the thank-you view and go Home after 2 seconds.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        // Programmatic navigation: change the route without the user clicking a link.
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{
        backgroundColor: '#080b12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 240, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00f0ff',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            flexShrink: 0
          }}>
            <PhoneCall size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                color: '#00f0ff',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '0.65rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '700'
              }}>
                ROUTER HOOK &bull; useNavigate()
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
              SomaiyaSat Ground Command Inquiry
            </h2>
          </div>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
          Submit mission payload inquiries, amateur radio reception logs, or satellite tracking questions directly to the flight operations team.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '8px', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'JetBrains Mono, monospace' }}>
                Inquiry / Technical Telecommand Query
              </label>
              <textarea
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your inquiry for the SomaiyaSat orbital telemetry team..."
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#04060a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '0.85rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#00f0ff',
                  color: '#04060a',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Send size={16} /> Submit &amp; Programmatically Redirect
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  padding: '0.85rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Home size={16} /> Jump Home Now
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
              Message Transmitted Successfully!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Demonstrating <code style={{ color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>useNavigate()</code>. Redirecting to Home Page in 2 seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
