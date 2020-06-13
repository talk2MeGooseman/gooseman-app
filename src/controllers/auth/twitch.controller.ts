import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import passport from 'passport';
var twitchStrategy = require('passport-twitch-new').Strategy;

require('dotenv').config();

passport.use(
  new twitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/auth/twitch/callback`,
      scope: 'user_read',
      customHeaders: {
        'client-id': process.env.TWITCH_CLIENT_ID,
      },
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(`Authenticated: `, accessToken, refreshToken, profile);
      // Create or Update credentials here
      done(null, profile);
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

class TwitchController implements IControllerBase {
  public path = '/auth/twitch';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, passport.authenticate('twitch'));
    this.router.get(this.path + '/callback', passport.authenticate('twitch', { failureRedirect: '/' }), this.callback);
  }

  callback = (req: Request, res: Response) => {
    res.render('posts/index', res);
  };
}

export default TwitchController;
