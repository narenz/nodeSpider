"use strict"
const express = require('express'),
    cheerio = require('cheerio'),
    request = require('request'),
    fs = require('fs'),
    app = express();

const scrape = require('./src/crawl');

app.get('/crawl', (req, response) => {
    const baseUrl = req.query.url;
    console.log(baseUrl);

    const scraper = new scrape(baseUrl, (obj) => {
        fs.writeFile('results.json', JSON.stringify(obj, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the results.json file');
            response.json(obj);
            process.exit();
        })
    });
    scraper.grabAllRelativeURLs();
});

app.listen(8081, (err) => {
    if (!err) {
        console.log('listening on ' + 8081);
    }
    else {
        process.exit();
    }
});