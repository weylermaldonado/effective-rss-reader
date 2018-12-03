const expect = require('chai').expect;
const feed = require('../lib/feed.lib.js');
const db = require('../database/db.lib.js');
const Parser = require('rss-parser');
const parser = new Parser({ headers: { charset: 'utf-8' } });
const c = console.log;

describe('getFeedsFromDatabase()', function(){
    it('Debe obtener un arreglo con los últimos 10 objetos guardados en la base de datos', async function(){
        
        /**
         * 1.- ARRANGE
         */
        const FEEDS_FROM_DB = [];
        const data = await db.getAllFeeds();

        for (let i = 0; i < data.length; i++) {
            FEEDS_FROM_DB[i] = {
                site: data[i].feed_site,
                title: data[i].feed_title,
                link: data[i].feed_url,
                pubdate: data[i].feed_pubdate,
            };
        }
        /**
         * 2.- ACT
         */
        const dataToTest = await feed.getFeedsFromDatabase();
        // console.log(dataToTest);
        
        /**
         * 3.- ASSERT
         */
        expect(dataToTest.length).to.be.equal(FEEDS_FROM_DB.length);
        
    });
});

describe('getSingleFeed(website)', function() {
    it('Debe obtener un arreglo de feeds de un único sitio web. Deben de coincidir el tamaño de los arreglos.', function() {
        /**
         * 1.- Arrange
         */
        let url = 'https://www.yucatan.com.mx/feed';
        const feed = await parser.parseURL(url);
        const items = feed.items;
        await dbLib.insertFeeds(items, url);
        const newData = await getSingleFeedFromDatabase(url);

    });
});