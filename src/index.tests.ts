import { expect } from 'chai';
import * as express from 'express';
import * as test from 'supertest';
import { Registry } from 'ts-registry';

import { middleware, request } from '.';

class NumberService {
  constructor(private readonly num: number) {}
  getNumber() {
    return this.num;
  }
}

describe('registry ScopeProvider', () => {
  it('returns the same instance of a service for all calls during the same request', async () => {
    // ARRANGE
    const registry = new Registry<{
      'number-service': NumberService;
    }>();

    registry
      .for('number-service')
      .withScope(request)
      .use(() => new NumberService(Math.random()));

    const app = express();
    app.use(middleware);

    app.get('/', (_req, res) => {
      const n1 = registry.get('number-service').getNumber();
      const n2 = registry.get('number-service').getNumber();
      res.send({ n1, n2 });
    });

    // ACT
    const result = await test(app).get('/');

    // ASSERT
    expect(result.body.n1).to.equal(result.body.n2);
  });

  it('returns different instances of a service during multiple concerent requests', async () => {
    // ARRANGE
    const registry = new Registry<{
      'number-service': NumberService;
    }>();

    registry
      .for('number-service')
      .withScope(request)
      .use(() => new NumberService(Math.random()));

    const app = express();
    app.use(middleware);

    app.get('/', (_req, res) => {
      setTimeout(() => {
        const n1 = registry.get('number-service').getNumber();
        const n2 = registry.get('number-service').getNumber();

        setTimeout(() => {
          res.send({ n1, n2 });
        }, 10);
      }, 10);
    });

    const sut = test(app);

    // ACT
    const [result1, result2] = await Promise.all([sut.get('/'), sut.get('/')]);

    // ASSERT
    expect(result1.body.n1).to.equal(result1.body.n2);
    expect(result2.body.n1).to.equal(result2.body.n2);
    expect(result1.body.n1).to.not.equal(result2.body.n1);
    expect(result1.body.n2).to.not.equal(result2.body.n2);
  });
});
