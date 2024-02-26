// controllers/queryController.js
const express = require('express');
const router = express.Router();
const {getTopResults} = require('../services/vectorDB');

router.get('/query', async (req, res) => {
  const { question } = req.query;
  try {
    const queryResult = await getTopResults(question);
    res.json({ results: queryResult });
  } catch (error) {
    console.error("Error in /query route:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
