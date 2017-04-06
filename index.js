const req = require('request');
const URL_Parse = require('url-parse');
const cheerio = require('cheerio');

const URL_TO_CRAWL = "https://gocardless.com";
const URL_REGEX = 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';
var allAbsoluteLinks = [];

req(URL_TO_CRAWL, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        const $ = cheerio.load(body)
        // console.log("Page title:  " + $('title').text());
        var absoluteLinks = $("[href^='http']");
        
        absoluteLinks.each(function () {
            allAbsoluteLinks.push($(this).attr('href'));
        });
        console.log(allAbsoluteLinks);
    }
});