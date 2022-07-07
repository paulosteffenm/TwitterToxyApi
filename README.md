# Twitter Toxicity API

## TL;DR

```js
// How to request
YOUR_URL/api?query=(String1 String2)
```

## About

This was the final project of the AI learning taught by [Ricardo Westhauser](https://github.com/rswesthauser).

This Api is supposed to work with this [APP](https://github.com/paulosteffenm/TwitterToxy).

The project searches for tweets with the given keywords and returns the toxicity score of the tweet.

## Setup

```bash
npm i
```

## Run

```bash
npm run dev
```

## How to search (basic)

```ts
// query must be a string
// exemple: http://localhost:4002/api?query=(Word1 Word2)
const { query } = req.query;
```

# Used packages

- [axios](https://www.npmjs.com/package/axios)

- [cors](https://www.npmjs.com/package/cors)

- [express](https://www.npmjs.com/package/express)

- [tensorflow](https://www.npmjs.com/package/@tensorflow/tfjs)

- [toxicity/model](https://www.npmjs.com/package/@tensorflow-models/toxicity)
