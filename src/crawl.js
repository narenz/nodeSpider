"use strict"
const req = require('request'),
    cheerio = require('cheerio');

const URL_REGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
let allRelativeLinks = [],
    linksVisited = [];
let results = {};
let linksVisitedCount = 0;

const extract = require('./extractAssets.js');
const getURL = require('./httpService.js').getURL;

module.exports = exports = function (urlToCrawl, callbackFunc) {
    let regex = new RegExp(URL_REGEX);

    if (!urlToCrawl.match(regex)) {
        callbackFunc('Bad URL');
        return;
    }

    this.grabAllRelativeURLs = () => {
        this.success = (body) => {
            const $ = cheerio.load(body);
            let links = $("a[href^='/']");
            $(links).each((i, link) => {
                allRelativeLinks.push(urlToCrawl + $(link).attr('href'));
            });
            console.log(allRelativeLinks.length + ' links found');
            this.crawl();
        }
        this.err = (error) => {
            callbackFunc('URL not reachable ' + error);
        }
        getURL(urlToCrawl, this.success, this.err);
    }

    this.crawl = () => {
        let nextLink = allRelativeLinks.pop();
        linksVisitedCount++;
        console.log("visiting: " + nextLink);

        if (nextLink && nextLink in linksVisited) {
            this.crawl();
        } else if (linksVisitedCount <= allRelativeLinks.length) {
            this.visitPageToExtractData(nextLink, this.crawl);
        } else {
            callbackFunc(results);
            return;
        }
    }

    this.visitPageToExtractData = (url, callback) => {
        linksVisited[url] = true;
        this.success = (body) => {
            const $ = cheerio.load(body);
            results[url] = {};
            results[url].js = extract($, 'script', 'src');
            results[url].images = extract($, 'img', 'src');
            results[url].css = extract($, 'link', 'href', 'css');
            callback();
        }
        this.err = (error) => {
            console.log('URL not reachable ' + error);
        }
        getURL(urlToCrawl, this.success, this.err);
    }
}