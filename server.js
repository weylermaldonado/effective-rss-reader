require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const feedly = require('./lib/feed.lib.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

async function hendleFeed(req, res) {
  const query  = req.query;
  const website = query.website;
  const refreshAll = query.refresh_all;
  let feed = '';
  if (typeof website !== 'undefined') {
    feed = await feedly.refreshSingleFeed(website);
  } else if(typeof refreshAll !== 'undefined'){
    feed = await feedly.getFeedsFromDatabase();
  }else{
    feed = await feedly.refreshAllFeeds();
  }

  res.status(200).json({
    ok: true,
    feed
  });
}

app.use('/webhook/feed', hendleFeed);

app.listen(process.env.PORT);
