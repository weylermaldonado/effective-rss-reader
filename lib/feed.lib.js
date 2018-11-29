

const Parser = require('rss-parser');

const parser = new Parser({ headers: { charset: 'utf-8' } });
const dbLib = require('../database/db.lib.js');


/**
 * Refresh the database by the website selected.
 * [TODO] Implement a flag to control the time to get the recent post in rss channel.
 * [DONE] Implement function that receives the whole records from database and send it to client.
 * @param {*} website
 */
async function refreshSingleFeed(website) {
  let selection;


  switch (website) {
    case 'ed-team':
      selection = 'https://ed.team/blog.xml';
      break;
    case 'soldai-blog':
      selection = 'https://medium.com/feed/soldai';
      break;
    case 'cog-blog':
      selection = 'https://cogdogblog.com/feed/';
      break;
    case 'diario-yucatan':
      selection = 'https://www.yucatan.com.mx/feed';
      break;
    case 'ny-times':
      selection = 'http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml';
      break;
    default:
      break;
  }

  if (typeof selection !== 'undefined') {
    const feed = await parser.parseURL(selection);
    const items = feed.items;

    await dbLib.insertFeeds(items, selection);
    const newData = await getSingleFeedFromDatabase(selection);
    
    return newData;
  }

  return { err: true, message: 'Debe seleccionar una opción' };
}

/**
 * [DONE] Implement a function to get ALL new information for each website.
 */
async function refreshAllFeeds() {
  const WEBSITES = [
    {'site_id': 'ed-team', 'site_url': 'https://ed.team/blog.xml'},
    {'site_id': 'soldai-blog', 'site_url': 'https://medium.com/feed/soldai'},
    {'site_id': 'cog-blog', 'site_url': 'https://cogdogblog.com/feed/'},
    {'site_id': 'diario-yucatan', 'site_url': 'https://www.yucatan.com.mx/feed'},
    {'site_id': 'ny-times', 'site_url': 'http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml'}
  ];
  const WEBSITES_LENGTH = WEBSITES.length;
  let newData = '';
  for(let i = 0; i < WEBSITES_LENGTH; i++) {
    const feed = await parser.parseURL(WEBSITES[i].site_url);
    const items = feed.items;
    await dbLib.insertFeeds(items, WEBSITES[i].site_url);
    newData = await getFeedsFromDatabase();
  }
  
  return newData;

}


/**
 * Recover the last information inserted into database, parse it and send it to the client.
 */
async function getFeedsFromDatabase() {
  const FEEDS_FROM_DB = [];
  const data = await dbLib.getAllFeeds();

  for (let i = 0; i < data.length; i++) {
    FEEDS_FROM_DB[i] = {
      site: data[i].feed_site,
      title: data[i].feed_title,
      link: data[i].feed_url,
      pubdate: data[i].feed_pubdate,
    };
  }

  return FEEDS_FROM_DB;
}
/**
 * Recover the last information inserted from a single feed, parse it and send it to the client.
 * @param {*} feedURL 
 */
async function getSingleFeedFromDatabase(feedURL) {
  const FEEDS_FROM_DB = [];
  const data = await dbLib.getSingleFeed(feedURL);

  for (let i = 0; i < data.length; i++) {
    FEEDS_FROM_DB[i] = {
      site: data[i].feed_site,
      title: data[i].feed_title,
      link: data[i].feed_url,
      pubdate: data[i].feed_pubdate,
    };
  }

  return FEEDS_FROM_DB;
}

exports.refreshSingleFeed = refreshSingleFeed;
exports.refreshAllFeeds = refreshAllFeeds;
exports.getSingleFeed = getSingleFeedFromDatabase;
exports.getFeedsFromDatabase = getFeedsFromDatabase;
