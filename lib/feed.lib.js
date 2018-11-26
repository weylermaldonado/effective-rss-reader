

const Parser = require('rss-parser');

const parser = new Parser({ headers: { charset: 'utf-8' } });
const dbLib = require('../database/db.lib.js');


/**
 * Refresh the database by the website selected.
 * [TODO] Implement a flag to control the time to get the recent post in rss channel.
 * [DONE] Implement function that receives the whole records from database and send it to client.
 * @param {*} website
 */
async function refreshFeeds(website) {
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
    default:
      break;
  }

  if (typeof selection !== 'undefined') {
    const feed = await parser.parseURL(selection);
    const items = feed.items;

    await dbLib.insertFeeds(items, selection);
    const newData = await getFeedsFromDatabase();

    return newData;
  }

  return { err: true, message: 'Debe seleccionar una opción' };
}

/**
 * [TODO] Implement a function to get ALL new information for each website.
 */

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

exports.refreshFeeds = refreshFeeds;
exports.getFeedsFromDatabase = getFeedsFromDatabase;
