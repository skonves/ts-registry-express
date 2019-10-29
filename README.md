[![travis](https://img.shields.io/travis/skonves/ts-registry-express.svg)](https://travis-ci.org/skonves/ts-registry-express)
[![coveralls](https://img.shields.io/coveralls/skonves/ts-registry-express.svg)](https://coveralls.io/github/skonves/ts-registry-express)
[![NPM Version](https://img.shields.io/npm/v/ts-registry-express.svg)](https://npmjs.com/package/ts-registry-express)

# ts-registry-express

Custom [`ts-registry`](https://github.com/ChristianAlexander/ts-registry) scope provider for [Express](https://expressjs.com/) requests.

## Quick Start

```Typescript
import * as express from 'express';
import { Registry } from 'ts-registry';
import { middleware, request } from 'ts-registry-express';

// define a request-scoped service
const registry = new Registry();
registry
  .for('my-service')
  .withScope(request)
  .use(() => new MyService())

// use the middleware
const app = express();
app.use(middleware);

// get an instance of the service
app.get('/', (req, res) => {
  // service instance is unique to this request
  const service = registry.getService('my-service');
})
```

## Access to the current Request

The target scope for this `ScopeProvider` is the current `Request` object and can be accessed via the second parameter of the service initializer.

Example:

```Typescript
registry
  .for('my-service')
  .withScope(request)
  .use((_get, req) => new MyService(req.session))
```

Because service instantiation is deferred, request-scoped service initializers can be defined outside of standard Express middleware, routers, or other handlers. However, when the `registry.get()` is called during a request (even if the call is made from another another function or module) the service initializer is passed the instance of the current request as the second argument.

Note that if you hold onto a reference of `req` within either the service intializer or other code, it will not be garbage collected and will lead to a memory leak.
