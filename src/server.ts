import App from './app'
require('dotenv').config()

import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'
import helmet from "helmet";

import PostsController from './controllers/posts/posts.controller'
import HomeController from './controllers/home/home.controller'
import TwitchController from './controllers/auth/twitch.controller'
import passport from 'passport';
import FaunaDB from './connectors/fauna-db';

const faunaDb = new FaunaDB()

const app = new App({
    port: <number><unknown>process.env.PORT || 4000,
    controllers: [
        new HomeController(),
        new PostsController(faunaDb),
        new TwitchController(),
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware,
        helmet(),
        passport.initialize(),
    ]
})
app.listen()
