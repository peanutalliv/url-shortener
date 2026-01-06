// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // for generating short codes

// Create Express app
const app = express();

// Middleware
app.use(cors()); // allow all origins
app.use(bodyParser.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// URL Schema & Model
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Url = mongoose.model('Url', urlSchema);

// POST /api/shorten
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'Original URL is required.' });

  try {
    let url = await Url.findOne({ originalUrl });
    if (url) return res.json({ shortCode: url.shortCode, originalUrl: url.originalUrl });

    const shortCode = crypto.randomBytes(3).toString('hex');
    url = new Url({ originalUrl, shortCode });
    await url.save();

    res.json({ shortCode, originalUrl });
  } catch (err) {
    console.error('Error shortening URL:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /:shortCode
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
    if (url) return res.redirect(url.originalUrl);
    return res.status(404).json({ error: 'Short URL not found.' });
  } catch (err) {
    console.error('Error redirecting:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Optional health check route
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));