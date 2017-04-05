const req = require('request');
const URL_Parse = require('url-parse');
const cheerio = require('cheerio');

const URL_TO_CRAWL = "https://google.com";

req(URL_TO_CRAWL, (error, response, body) => {
    if(!error && response.statusCode === 200) {
        const $ = cheerio.load(body)
        // console.log("Page title:  " + $('title').text());

        const pageLinks = $("a[href^='http']");

        console.log(pageLinks);
    }
});