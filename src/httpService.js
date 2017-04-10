"use strict"
const req = require('request');

module.exports = (urlToCrawl, callbackFunc) => {
    req(urlToCrawl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callbackFunc(body);
        }
        else {
            console.log('URL not reachable' + error);
            callbackFunc(error);
        }
    });
}