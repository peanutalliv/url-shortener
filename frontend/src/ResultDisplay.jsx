import React from 'react';

export default function ResultDisplay({ shortUrl, error }) {
  if (!shortUrl && !error) return null;

  // Simple URL validation function
  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Function to copy the URL to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy'));
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shortUrl && (
        <div style={{ padding: '10px', background: '#f2f2f2' }}>
          <p>Your shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          <button
            onClick={handleCopy}
            disabled={!isValidUrl(shortUrl)}
            style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}