"use strict"
const req = require('request');

var getURL = (urlToCrawl, callbackSuccess, callbackErr) => {
    req(urlToCrawl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callbackSuccess(body);
        }
        else {
            console.log('URL not reachable' + error);
            callbackErr(error);
        }
    });
}

module.exports.getURL = getURL;
