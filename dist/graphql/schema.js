"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tools_1 = require("graphql-tools");
const resolvers_1 = tslib_1.__importDefault(require("./resolvers"));
const typeDefs_1 = tslib_1.__importDefault(require("./typeDefs"));
const schema = graphql_tools_1.makeExecutableSchema({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default,
});
exports.default = schema;
//# sourceMappingURL=schema.js.map