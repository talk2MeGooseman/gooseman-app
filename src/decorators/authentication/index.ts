import { Request, Response } from 'express';

export function authenticate(method) {
  return function (req: Request, res: Response, _next) {
    if (req.isAuthenticated()) {
      return method.apply(this, arguments);
    } else {
      return res.redirect('/auth/twitch');
    }
  };
}
