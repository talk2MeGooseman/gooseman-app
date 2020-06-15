import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import passport from 'passport';
import FaunaDB from 'connectors/fauna-db';

require('dotenv').config();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

class TwitchController implements IControllerBase {
  public path = '/auth/twitch';
  public router = express.Router();

  constructor(db: FaunaDB) {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, passport.authenticate('twitch'));
    this.router.get(this.path + '/callback', passport.authenticate('twitch', { failureRedirect: '/'  }), this.callback);
  }

  callback = (req: Request, res: Response) => {
    res.render('posts/index', res);
  };
}

export default TwitchController;
