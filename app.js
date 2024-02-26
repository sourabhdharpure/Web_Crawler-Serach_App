// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const crawlController = require('./controllers/crawlController');
const queryController = require('./controllers/queryController');
require('dotenv').config();
const config = require('./config');


const app = express();
const port = config.PORT || 3000;

app.use(bodyParser.json());

app.use('/', crawlController);
app.use('/', queryController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
