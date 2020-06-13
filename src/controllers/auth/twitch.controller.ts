import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import passport from 'passport';
import FaunaDB from 'connectors/fauna-db';
var twitchStrategy = require('passport-twitch-new').Strategy;

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
        async function (accessToken, refreshToken, profile, done) {
          const doc = await db.query.findByIndex('authentications_by_provider', 'twitch').execute();
          const data = {
            uid: profile.id,
            provider: profile.provider,
            accessToken,
            refreshToken,
            data: profile,
          };

          // Create or Update credentials here
          if (doc) {
            await db.query.update(doc.ref, data).execute()
          } else {
            await db.query
              .create('authentications', data)
              .execute();
          }
          done(null, profile);
        },
      ),
    );
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
