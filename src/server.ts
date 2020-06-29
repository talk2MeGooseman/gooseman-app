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
import initTwitchPassport from './middleware/passport-twitch';
import initPatreonPassport from './middleware/passport-patreon';
import PatreonController from './controllers/auth/patreon.controller';

const faunaDb = new FaunaDB();
const twitchPassport = initTwitchPassport({ faunaDb })
const patreonPassport = initPatreonPassport({ faunaDb })

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
    twitchPassport.initialize(),
    twitchPassport.session(),
    patreonPassport.initialize(),
    patreonPassport.session(),
  ],
});

app.listen();
