'use strict'

require('dotenv').config();
const mysql = require('mysql');
const moment = require('moment');

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

// async function test() {
//     let test =  {
//         "site": "https://medium.com/feed/soldai",
//         "title": "Videojuegos muy inteligentes",
//         "link": "https://medium.com/soldai/videojuegos-muy-inteligentes-6e292f595022?source=rss----47994cf955e0---4",
//         "pubdate": "Tue, 27 Mar 2018 17:38:37 GMT"
//     }
//     await insertFeeds(test);
// }
async function insertFeeds(feed_item) {

    let _date = moment(Date.parse(feed_item.pubdate)).format('YYYY-MM-DD HH:mm:ss');

    let feed = {
        feed_site: feed_item.site,
        feed_title: feed_item.title,
        feed_url: feed_item.link,
        feed_pubdate: _date
    };
    connection.query("INSERT INTO feeds SET ? ON DUPLICATE KEY UPDATE feed_site = '" + feed.feed_site 
                                                                    + "', feed_url = '" + feed.feed_url + 
                                                                    "', feed_pubdate = '" + feed.feed_pubdate + "'"
        ,feed,function(error, results, fields){
        if (error) throw error;
        console.log('1 elemento insertado');
        // connection.end();
    });
}

// test();


exports.insertFeeds = insertFeeds;