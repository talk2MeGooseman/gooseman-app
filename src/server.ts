import App from './app';
require('dotenv').config();

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';
import helmet from 'helmet';
import session from 'express-session';
import cookieParser from "cookie-parser";

import PostsController from './controllers/posts/posts.controller';
import HomeController from './controllers/home/home.controller';
import TwitchController from './controllers/auth/twitch.controller';
import FaunaDB from './connectors/fauna-db';
import passport from 'passport';
var twitchStrategy = require('passport-twitch-new').Strategy;

const faunaDb = new FaunaDB();

passport.use(
  new twitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_SECRET,
      callbackURL: `${process.env.HOST}/auth/twitch/callback`,
      scope: 'user_read',
      customHeaders: {
        'client-id': process.env.TWITCH_CLIENT_ID,
      },
    },
    async function (accessToken, refreshToken, profile, done) {
      if (profile.id !== '120750024') {
        return done('Unauthorized', null)
      }
      const doc = await faunaDb.query.findByIndex('authentications_by_provider', 'twitch').execute();
      const data = {
        uid: profile.id,
        provider: profile.provider,
        accessToken,
        refreshToken,
        data: profile,
      };

      // Create or Update credentials here
      if (doc) {
        await faunaDb.query.update(doc.ref, data).execute();
      } else {
        await faunaDb.query.create('authentications', data).execute();
      }
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

const app = new App({
  port: <number>(<unknown>process.env.PORT) || 4000,
  controllers: [new HomeController(faunaDb), new PostsController(faunaDb), new TwitchController(faunaDb)],
  middleWares: [
    loggerMiddleware,
    cookieParser(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    helmet(),
    session({ secret: 'cats', resave: true, saveUninitialized: true }),
    passport.initialize(),
    passport.session(),
  ],
});
app.listen();
