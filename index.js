"use strict"
const req = require('request');
const URL_Parse = require('url-parse');
const cheerio = require('cheerio');

const URL_TO_CRAWL = "https://gocardless.com";
const URL_REGEX = 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';
var allRelativeLinks = [];

req(URL_TO_CRAWL, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        const $ = cheerio.load(body)
        // console.log("Page title:  " + $('title').text());
        let links =  $("a[href^='/']");
        $(links).each(function (i, link) {
            console.log($(link).text() + ':\t  ' + $(link).attr('href'));
            allRelativeLinks = $(link).attr('href')
        });
    }
    else {
        console.log(response.statusCode);
    }
});