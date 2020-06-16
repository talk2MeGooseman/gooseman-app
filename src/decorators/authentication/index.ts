import { Request, Response } from 'express'

export function authenticate() {
  return function (target: Object, propertyName: string, propertyDesciptor: PropertyDescriptor) {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = function (req: Request, res: Response, next) {
      if(req.isAuthenticated()) {
        return method.apply(this, req, res, next);;
      } else {
        return res.redirect('/auth/twitch');
      }
  }
  return propertyDesciptor;
  };
}
