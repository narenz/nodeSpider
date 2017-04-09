"use strict"
const req = require('request'),
    URL_Parse = require('url-parse'),
    cheerio = require('cheerio');

const URL_REGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
let allRelativeLinks = [],
    linksVisited = [];
let results = {};
let linksVisitedCount = 0;

const Scrape = function (urlToCrawl, callbackFunc) {
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
        console.log(nextLink);
        if (nextLink && nextLink in linksVisited) {
            this.crawl();
        } else if (linksVisitedCount <= allRelativeLinks.length) {
            this.visitPageToExtractData(nextLink, this.crawl);
        } else {
            console.log('Done');
            jsonfile.writeFile('result.json', results, (err) => {
                console.error(err)
            })
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