import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps one or more middleware handlers so GET requests skip authentication/authorization.
 */
export const publicRoute = (...middlewares: RequestHandler[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'GET') {
      next();
      return;
    }

    if (middlewares.length === 0) {
      next();
      return;
    }

    let index = 0;
    const run = (err?: any) => {
      if (err) {
        next(err);
        return;
      }

      const handler = middlewares[index++];
      if (!handler) {
        next();
        return;
      }

      handler(req, res, run);
    };

    run();
  };
};

