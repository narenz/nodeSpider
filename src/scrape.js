"use strict"
const req = require('request');
const URL_Parse = require('url-parse');
const cheerio = require('cheerio');

// const urlToCrawl = "https://gocardless.com";
// const URL_REGEX = 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';
let allRelativeLinks = [];
let results = {};
let linksVisited = [];
let pageCount = 0;

const Scrape = function (urlToCrawl, callbackFunc) {
    this.getAllRelativeURL = () => {
        req(urlToCrawl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(body);
                let links = $("a[href^='/']");
                $(links).each((i, link) => {
                    allRelativeLinks.push($(link).attr('href'));
                });
                console.log(allRelativeLinks.length + ' links found');
                this.crawl();
            }
            else {
                console.error(err);
            }
        });
    }

    this.crawl = () => {
        let nextPage = allRelativeLinks.pop();
        pageCount++;
        console.log(urlToCrawl + nextPage);
        if (nextPage && nextPage in linksVisited) {
            crawl();
        } else if (pageCount <= allRelativeLinks.length) {
            this.visitPageToExtractData(urlToCrawl + nextPage, this.crawl);
        } else {
            console.log('Done');
            callbackFunc(results);
            return;
        }
    }

    this.visitPageToExtractData = (url, callback) => {
        linksVisited[url] = true;
        req(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(body);
                results[url] = {};
                results[url].js = this.extractAssets($, 'script', 'src');
                results[url].images = (this.extractAssets($, 'img', 'src'));
                callback();
            }
            else {
                callback();
                return;
            }
        });
    }

    this.extractAssets = ($, ele, atr) => {
        let selectors = $(ele);
        let assets = [];
        $(selectors).each((i, link) => {
            if ($(link).attr(atr))
                assets.push($(link).attr(atr));
        });
        return assets;
    }
}

module.exports = Scrape;