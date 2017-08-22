# monk-middleware-timestamps

[![Build Status](https://travis-ci.org/thechatshop/monk-middleware-timestamps.svg?branch=master)](https://travis-ci.org/thechatshop/monk-middleware-timestamps)

A monk middleware that automatically adds `createdAt` and `updatedAt` properties.

### How to install

```sh
npm install --save monk-middleware-timestamps
```

### How to use

```js
db.addMiddleware(require('monk-middleware-timestamps'));
```
