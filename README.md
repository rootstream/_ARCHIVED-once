# once

[![CircleCI](https://circleci.com/gh/rootstream/once/tree/master.svg?style=svg)](https://circleci.com/gh/rootstream/once/tree/master)

async friendly version of https://www.npmjs.com/package/once

## usage

in your npm console:

```bash
npm install --save @rootstream/once
```

in your code:

```JS
const once = require('@rootstream/once');

async function sample() { /* ... */ };
// guarantees sample() is called only and only once during app's lifetime
const sampleOnce = once(sample)
// guarantees sample() is called only and only once during function's execution lifetime
const sampleOnceReentrant = once(sample, { reentrant: true })
```
