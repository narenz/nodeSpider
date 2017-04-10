import chai from 'chai';
import spies from 'chai-spies';
chai.should();
chai.use(spies);

const Crawler = require('../src/crawl.js');

describe('Crawler initialisation', function () {

    let crawlerSpy;
    let callbackFn = (res) => {
        //console.log("callbacked:" + res);
    }

    beforeEach(() => {
        crawlerSpy = chai.spy(callbackFn);
    });

    afterEach(() => {
        crawlerSpy.reset();
    });

    it('requires two arguments', () => {
        const test1 = () => {
            new Crawler();
        }
        (test1).should.throw(Error);

        const test2 = () => {
            new Crawler('http://urlToCrawl', callbackFn);
        }
        (test2).should.not.throw(Error);
    });

    it('should return "Bad URL" with invalid url', () => {
        new Crawler('http://urlToCrawl', crawlerSpy);
        crawlerSpy.should.be.spy;
        crawlerSpy.should.have.been.called.once;
        crawlerSpy.should.have.been.called.with('Bad URL');
    });

    it('should not call spies with valid url', () => {
        new Crawler('https://gocardless.com', crawlerSpy);
        crawlerSpy.should.be.spy;
        crawlerSpy.should.have.not.been.called();
    });
});