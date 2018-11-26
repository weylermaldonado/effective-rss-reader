require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const feedly = require('./lib/feed.lib.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function hendleFeed(req, res) {
  const query  = req.query;
  const website = query.website;
  let feed = '';
  if (typeof website !== 'undefined') {
    feed = await feedly.refreshFeeds(website);
  } else {
    feed = await feedly.getFeedsFromDatabase();
  }

  res.status(200).json({
    ok: true,
    feed,
  });
}

app.use('/webhook/feed', hendleFeed);

app.listen(process.env.PORT);
