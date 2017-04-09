const express = require('express'),
    cheerio = require('cheerio'),
    request = require('request'),
    jsonfile = require('jsonfile');
const app = express();

const scrape = require('./src/scrape');

app.get('/crawl', (req, response) => {
    const baseUrl = req.query.url;
    console.log(baseUrl);

    const scraper = new scrape(baseUrl, (obj) => {
        jsonfile.writeFile('result.json', obj, (err) => {
            console.error(err)
        })
        response.json(obj);
        process.exit();
    });
    scraper.getAllRelativeURL();
});

app.listen(8081, (err) => {
    if (!err) {
        console.log('listening on ' + 8081);
    }
});