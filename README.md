## Description

Backend app for posting to social media, exposes API:

- POST http://localhost:3000/posts with body { "platform": "x", "text": "post text" }
  - it checks the text with OpenAPI Moderation API and posts to X/Twitter if its fine.

## Project setup

1. Install dependecies:

```bash
$ npm install
```

2. Prepare `.env` file based on `.env.example`.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
