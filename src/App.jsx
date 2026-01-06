import React, { useState } from 'react';
import UrlForm from './UrlForm';
import ResultDisplay from './ResultDisplay';

export default function App() {
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>URL Shortener</h1>
      <UrlForm setShortUrl={setShortUrl} setError={setError} />
      <ResultDisplay shortUrl={shortUrl} error={error} />
    </div>
  );
}