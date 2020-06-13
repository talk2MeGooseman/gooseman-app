"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = tslib_1.__importDefault(require("./graphql/schema"));
const graphql_depth_limit_1 = tslib_1.__importDefault(require("graphql-depth-limit"));
const twitch_1 = tslib_1.__importDefault(require("twitch"));
const twitch_2 = tslib_1.__importDefault(require("./constants/twitch"));
const server = new apollo_server_express_1.ApolloServer({
    schema: schema_1.default,
    validationRules: [graphql_depth_limit_1.default(7)],
    context: async () => ({
        twitchClient: twitch_1.default.withClientCredentials(twitch_2.default.clientId, twitch_2.default.clientSecret),
    }),
});
class App {
    constructor(appInit) {
        this.app = express_1.default();
        this.port = appInit.port;
        server.applyMiddleware({ app: this.app });
        this.middlewares(appInit.middleWares);
        this.routes(appInit.controllers);
        this.assets();
        this.template();
    }
    middlewares(middleWares) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    }
    routes(controllers) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
    assets() {
        this.app.use(express_1.default.static('public'));
        this.app.use(express_1.default.static('views'));
    }
    template() {
        this.app.set('view engine', 'pug');
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
            console.log(`GQL 🚀 Server ready at http://localhost:${this.port}${server.graphqlPath}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map