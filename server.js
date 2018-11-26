'use strict'

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const feedly = require('./lib/feed.lib.js');
const c = console.log;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function hendleFeed(req, res) {

  let query = req.query;
  let website = query.website;
  
  let feed = await feedly.getFeeds(website);
  
  res.status(200).json({
    "ok": true,
    feed
  });

} 

app.use('/webhook/feed', hendleFeed);

app.listen(process.env.PORT, () => {
  c(`Servidor en puerto ${process.env.PORT}`);
});