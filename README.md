# Node-Spider-project

## Installation:
```sh
$ npm install
```
## To Run:
```sh
$ npm start

Open browser and type localhost:8081/crawl?url=[YOUR_HTTP_URL] 
eg: http://localhost:8081/crawl?url=https://gocardless.com

$ cat results.json

```

## To test:
```sh
$ npm test

```

# Project Brief:
## Compeleted:

- This is a node project written using ES6 features.
- Unit testing written using Mocha and chai assertion.
- Use of 3rd party lib `Cheerio` to parse the html response
- Only used relative paths
- Assets grabbed using the <img> and <src> tags only.
- Crawl function recursively processes all relative links and grabs the assets.
- Writes JSON output to the HTTP response and also stores the output locally.

## To be improved:

- Better URL validations to include absolute URLs also.
- Better unit test coverage.
- Nested crawling i.e more than one level.
- To use promises instead of callbacks.
- To use test runner.