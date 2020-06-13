"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("./app"));
require('dotenv').config();
const bodyParser = tslib_1.__importStar(require("body-parser"));
const logger_1 = tslib_1.__importDefault(require("./middleware/logger"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const posts_controller_1 = tslib_1.__importDefault(require("./controllers/posts/posts.controller"));
const home_controller_1 = tslib_1.__importDefault(require("./controllers/home/home.controller"));
const twitch_controller_1 = tslib_1.__importDefault(require("./controllers/auth/twitch.controller"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const fauna_db_1 = tslib_1.__importDefault(require("./connectors/fauna-db"));
const faunaDb = new fauna_db_1.default();
const app = new app_1.default({
    port: process.env.PORT || 4000,
    controllers: [
        new home_controller_1.default(),
        new posts_controller_1.default(faunaDb),
        new twitch_controller_1.default(),
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        logger_1.default,
        helmet_1.default(),
        passport_1.default.initialize(),
    ]
});
app.listen();
//# sourceMappingURL=server.js.map