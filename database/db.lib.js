'use strict'

require('dotenv').config();
const mysql = require('mysql');
const moment = require('moment');
const c = console.log;
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port     : process.env.DB_PORT
});

/**
 * Get the XML parsed and save it into database.
 * [TODO] Fix the id issue
 * @param {*} feed_item 
 */
async function insertFeeds(feeds_array,website) {

    let feed = {};
    const FEED_LENGTH = feeds_array.length;
    let _date = '';
    for(let i = 0; i < FEED_LENGTH; i++) {
        _date = moment(Date.parse(feeds_array[i].pubdate)).format('YYYY-MM-DD HH:mm:ss');
        feed = {
            feed_site: website,
            feed_title: feeds_array[i].title,
            feed_url: feeds_array[i].link,
            feed_pubdate: _date
        };
    }
    connection.query("INSERT INTO feeds SET ? ON DUPLICATE KEY UPDATE feed_site = '" + feed.feed_site 
                                                                    + "', feed_url = '" + feed.feed_url + 
                                                                    "', feed_pubdate = '" + feed.feed_pubdate + "'"
        ,feed,function(error, results, fields){
        if (error) throw error;
        // console.log('1 elemento insertado');
    });
}

/**
 * Select the last data inserted into database.
 * [DONE] Select feeds from database and return it
 */
async function getAllFeeds() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT feed_title, feed_url,feed_site, feed_pubdate FROM feeds', function(error, results, fields){
            if(error) reject(error);
            resolve(results);
        });
    });
}



exports.insertFeeds = insertFeeds;
exports.getAllFeeds = getAllFeeds;