// Exp 3 + routing: a contact form with a controlled textarea. After submit it redirects to the
// home page from code, using the navigate function from React Router (useNavigate).
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const box = { padding: '0.8rem 1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: '#04060a', color: '#fff' };

export default function Contact() {
  const navigate = useNavigate();                  // function that changes the page from code
  const [message, setMessage] = useState('');      // text in the textarea (controlled input)
  const [submitted, setSubmitted] = useState(false); // false = show the form, true = show thank-you

  // Ignore empty messages; otherwise show the thank-you view and go Home after 2 seconds.
  const handleSubmit = (e) => {
    e.preventDefault();                            // stop the browser reloading the page
    if (message.trim()) {
      setSubmitted(true);
      setTimeout(() => navigate('/'), 2000);       // programmatic navigation
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '0.5rem' }}>Contact the ground team</h2>

      {/* Conditional rendering: form until submitted, then a thank-you message */}
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <textarea
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your inquiry..."
            required
            style={box}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" style={{ ...box, flex: 1, background: '#00f0ff', color: '#04060a', fontWeight: 700, cursor: 'pointer' }}>
              Submit and redirect
            </button>
            <button type="button" onClick={() => navigate('/')} style={{ ...box, cursor: 'pointer' }}>Jump home now</button>
          </div>
        </form>
      ) : (
        <p style={{ color: '#10b981' }}>Message sent. Redirecting to the home page in 2 seconds...</p>
      )}
    </div>
  );
}
