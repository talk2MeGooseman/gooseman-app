"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const faunadb_1 = tslib_1.__importStar(require("faunadb"));
require('dotenv').config();
class FaunaDB {
    constructor() {
        this.client = new faunadb_1.default.Client({ secret: process.env.FAUNA_DB_SECRET });
    }
    get query() {
        return new FaunaDBQuery(this.client);
    }
    create(collection, data) {
        return faunadb_1.query.Create(faunadb_1.query.Collection(collection), { data });
    }
}
exports.default = FaunaDB;
class FaunaDBQuery {
    constructor(client) {
        this.client = client;
    }
    getCollection(name) {
        this.scope = faunadb_1.query.Collection(name);
        return this;
    }
    getIndex(index) {
        this.scope = faunadb_1.query.Index(index);
        return this;
    }
    byRef(ref) {
        this.scope = faunadb_1.query.Ref(this.scope, ref);
        return this;
    }
    matching(value = undefined) {
        this.scope = value ? faunadb_1.query.Match(this.scope, value) : faunadb_1.query.Match(this.scope);
        return this;
    }
    get() {
        this.scope = faunadb_1.query.Get(this.scope);
        return this;
    }
    paginate() {
        this.scope = faunadb_1.query.Paginate(this.scope);
        return this;
    }
    all() {
        this.paginate();
        this.scope = faunadb_1.query.Map(this.scope, faunadb_1.query.Lambda("X", faunadb_1.query.Get(faunadb_1.query.Var("X"))));
        return this;
    }
    execute(options = {}) {
        return this.client.query(this.scope, options);
    }
}
//# sourceMappingURL=fauna-db.js.map