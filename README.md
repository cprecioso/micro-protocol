# `micro-protocol`

Adapted the
[`express.js` algorithm](hthttps://github.com/expressjs/express/blob/b8e50568af9c73ef1ade434e92c60d389868361d/lib/request.js#L306)
to a [`micro`](https://github.com/zeit/micro) middleware.

## Installation

```sh
$ npm install micro-protocol
```

## Example

```js
import protocol from "micro-protocol"

export default protocol(
  async (req, res) => {
    console.log(req.protocol) // -> "http", or "https"
  {
    trustProxy: true
    // (Optional - default `false`) Whether to trust the X-Forwarded-Proto if
    // you use a reverse proxy. You can also pass a function that accepts
    // `req.connection.remoteAddress` and returns a boolean whether to trust
    // it.
  }
)
```

If you don't use a bundler or ES module, you can import like

```js
const protocol = require("micro-protocol").default
```
