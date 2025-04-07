import { Request, type RequestHandler } from 'express';
import type { ScopeProvider } from 'ts-registry';

import * as httpContext from 'express-http-context';

const key = 'express_req';

export const request: ScopeProvider<Request> = {
  getTargetScope: () => httpContext.get(key),
  sourceScopeGetters: [
    () => {
      const req = httpContext.get(key);
      if (!req) throw new Error('Request not found in context');
      return req;
    },
  ],
};

export const middleware: RequestHandler[] = [
  httpContext.middleware,
  (req, _, next) => {
    httpContext.set(key, req);
    next();
  },
];
