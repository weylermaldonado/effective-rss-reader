'use strict'

const Parser = require('rss-parser');
const _parser = new Parser({headers: {'charset': 'utf-8'}});
const dbLib = require('./db.lib.js');
const c = console.log;

async function getFeeds(website) {
    
    let selection;
    let feed_items = [];

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

    if (typeof selection !== 'undefined')
    {
        let feed = await _parser.parseURL(selection);
        let items = feed.items;
        let feed_length = items.length;

        for(let i = 0; i < feed_length ; i ++)
        {
            feed_items[i] = {
                "site": selection,
                "title": items[i].title,
                "link": items[i].link,
                "pubdate": items[i].pubDate
            };
            await dbLib.insertFeeds(feed_items[i]);
        }
        
        return feed_items;
    }
    else
    {
        return {"err": true, "message": "Debe seleccionar una opción"};
    }

}

exports.getFeeds = getFeeds;