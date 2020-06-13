"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const graphql_tools_1 = require("graphql-tools");
const resolversArray = graphql_tools_1.loadFilesSync(path_1.default.join(__dirname, '.'));
exports.default = graphql_tools_1.mergeResolvers(resolversArray);
//# sourceMappingURL=index.js.map