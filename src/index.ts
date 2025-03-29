import type { RequestHandler } from 'express';
import { type ScopeProvider, singleton } from 'ts-registry';

import * as httpContext from 'express-http-context';

export const request: ScopeProvider<Request> = {
  getTargetScope: () => httpContext.get('express_req'),
  sourceScopeGetters: [
    () => httpContext.get('express_req'),
    ...singleton.sourceScopeGetters,
  ],
};

export const middleware: RequestHandler[] = [
  httpContext.middleware,
  (req, _, next) => {
    httpContext.set('express_req', req);
    next();
  },
];
