"use strict"
const req = require('request');
const URL_Parse = require('url-parse');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');

const URL_TO_CRAWL = "https://gocardless.com";
const URL_REGEX = 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';
let allRelativeLinks = [];
let results = {};
let linksVisited = [];
let pageCount = 0;

let getAllRelativeURL = () => {
    req(URL_TO_CRAWL, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(body);
            let links = $("a[href^='/']");
            $(links).each(function (i, link) {
                allRelativeLinks.push($(link).attr('href'));
            });
            console.log(allRelativeLinks.length + 'links found');
            crawl();
        }
    });
}

const crawl = () => {
    let nextPage = allRelativeLinks.pop();
    pageCount++;
    console.log(URL_TO_CRAWL + nextPage);
    if (nextPage && nextPage in linksVisited) {
        crawl();
    } else if (pageCount <= allRelativeLinks.length) {
        visitPage(URL_TO_CRAWL + nextPage, crawl);
    } else {
        console.log('Done');
        finish();
        return;
    }
}

const finish = () => {
    jsonfile.writeFile('result.json', results, function (err) {
        console.error(err)
    })
}

const visitPage = (url, callback) => {
    linksVisited[url] = true;
    req(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(body);
            results[url] = {};
            results[url].js = getAssets($, 'script', 'src');
            results[url].images = (getAssets($, 'img', 'src'));
            callback();
        }
        else {
            callback();
            return;
        }
    });
}

const getAssets = ($, ele, atr) => {
    let selectors = $(ele);
    let assets = [];
    $(selectors).each(function (i, link) {
        if ($(link).attr(atr))
            assets.push($(link).attr(atr));
    });
    return assets;
}

getAllRelativeURL();