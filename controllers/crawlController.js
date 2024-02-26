// controllers/crawlController.js
const express = require('express');
const router = express.Router();
const {crawlAndVectorize} = require('../services/crawler');

router.post('/crawl', async (req, res) => {
  const { url } = req.body;
  try {
    const crawledData = await crawlAndVectorize(url);
    res.status(200).json({ success: true, data: crawledData });
  } catch (error) {
    console.error("Error in /crawl route:", error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
