import type { Request, RequestHandler } from 'express';
import { type ScopeProvider, singleton } from 'ts-registry';

import * as httpContext from 'express-http-context';

const key = 'express_req';

export const request: ScopeProvider<Request> = {
  getTargetScope: () => httpContext.get(key),
  sourceScopeGetters: [
    () => httpContext.get(key),
    ...singleton.sourceScopeGetters,
  ],
};

export const middleware: RequestHandler[] = [
  httpContext.middleware,
  (req, _, next) => {
    httpContext.set(key, req);
    next();
  },
];
