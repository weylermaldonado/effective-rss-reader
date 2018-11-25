'use strict'

require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

async function insertFeeds() {
    
}
connection.query('SELECT * FROM feeds', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
});

connection.end();