import 'babel-polyfill';
import * as chai from 'chai';
const nock = require('nock');

let should = chai.should();

let getURL = require('../src/httpService.js').getURL;


describe('GET URL response', function () {

    beforeEach(function() {
        nock('https://gocardless.com')
                .get('/')
                .reply(200, {body: "<body><img src='smiley.gif'></body>"});
        
        nock('https://gocardless.com')
                .get('/err')
                .replyWithError('something awful happened');
    });

    it('returns URLs response', function (done) {
        const url = "https://gocardless.com";
        getURL(url, function(body) {
            body.should.be({"body":"<body><img src='smiley.gif'></body>"});
        },
        function(err){
            //console.log("err:"+ err)
        });
        done();
    });

     it('returns no URLs response', function (done) {
        const url = "https://gocardless.com/err";
        getURL(url, function(body) {
            body.should.be({"body":""});
        },
        function(err){
            //console.log("err:"+ err)
            err.should.be("Error: something awful happened");
        });
        done();
    });
});