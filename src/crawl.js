"use strict"
const req = require('request'),
    URL_Parse = require('url-parse'),
    cheerio = require('cheerio');

const URL_REGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
let allRelativeLinks = [],
    linksVisited = [];
let results = {};
let linksVisitedCount = 0;

const extract = require('./extractAssets.js');

module.exports = exports = function (urlToCrawl, callbackFunc) {
    var regex = new RegExp(URL_REGEX);
    if (!urlToCrawl.match(regex)) {
        callbackFunc('Bad URL');
        return;
    }

    this.initialRelativeURLGrab = () => {
        req(urlToCrawl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(body);
                let links = $("a[href^='/']");
                $(links).each((i, link) => {
                    allRelativeLinks.push(urlToCrawl + $(link).attr('href'));
                });
                console.log(allRelativeLinks.length + ' links found');
                this.crawl();
            }
            else {
                console.log('URL not reachable' + error);
                callbackFunc(error);
            }
        });
    }

    this.crawl = () => {
        let nextLink = allRelativeLinks.pop();
        linksVisitedCount++;
        console.log("visiting "+nextLink);

        if (nextLink && nextLink in linksVisited) {
            this.crawl();
        } else if (linksVisitedCount <= allRelativeLinks.length) {
            this.visitPageToExtractData(nextLink, this.crawl);
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
                results[url].js = extract($, 'script', 'src');
                results[url].images = (extract($, 'img', 'src'));
                callback();
            }
        });
    }
}