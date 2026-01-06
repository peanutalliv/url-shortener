import React, { useState } from 'react';

export default function UrlForm({ setShortUrl, setError }) {
  const [originalUrl, setOriginalUrl] = useState('');

  // Simple URL validation function
  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    setError('');
    setShortUrl('');

    if (!originalUrl) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
        mode: 'cors',
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Something went wrong');
      }

      const data = await response.json();
      setShortUrl(`http://127.0.0.1:5001/${data.shortCode}`);

    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch from backend. Make sure the server is running and CORS is enabled.');
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter a long URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        style={{ width: '100%', padding: '10px', marginTop: '20px' }}
      />
      <button
        onClick={handleShorten}
        style={{ width: '100%', padding: '10px', marginTop: '10px' }}
      >
        Shorten URL
      </button>
    </>
  );
}