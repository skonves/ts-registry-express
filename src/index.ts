import { Request, Response, NextFunction } from 'express';
import { ScopeProvider, singleton } from 'ts-registry';

import * as httpContext from 'express-http-context';

export const request: ScopeProvider<Request> = {
  getTargetScope: () => httpContext.get('express_req'),
  sourceScopeGetters: [
    () => httpContext.get('express_req'),
    ...singleton.sourceScopeGetters,
  ],
};

export const middleware = [
  httpContext.middleware,
  (req: Request, _res: Response, next: NextFunction) => {
    httpContext.set('express_req', req);
    next();
  },
];
