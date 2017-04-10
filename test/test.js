import 'babel-polyfill';
import * as chai from 'chai';
import cheerio from 'cheerio';

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
let Extractor = require('../src/extractAssets.js');

describe('extractor', function() {

    it('shoule return empty array when no assets found', () =>{
        const $ = cheerio.load("<body></body>");
        let assets = new Extractor($, 'img', 'src');
        assets.should.be.a('array');
        assets.should.have.lengthOf(0);
    })

    it('shoule return empty array when no src attribute is empty', () =>{
        const $ = cheerio.load("<body><img src=''></body>");
        let assets = new Extractor($, 'img', 'src');
        assets.should.be.a('array');
        assets.should.have.lengthOf(0);
    })

    it('should extract assets from a valid HTML', function () {
        const $ = cheerio.load("<body><img src='smiley.gif'></body>");
        let assets = new Extractor($, 'img', 'src');
        assets.should.be.a('array');
        assets.should.have.lengthOf(1);
    });
});
