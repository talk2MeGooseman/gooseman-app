import faunadb, { query as q } from 'faunadb';
require('dotenv').config();

export default class FaunaDB {
  private client: faunadb.Client;

  constructor() {
    this.client = new faunadb.Client({ secret: process.env.FAUNA_DB_SECRET });
  }

  get query() {
    return new FaunaDBQuery(this.client);
  }

  create(collection: string, data: any) {
    return q.Create(q.Collection(collection), { data });
  }
}

class FaunaDBQuery {
  scope: faunadb.Expr

  client: faunadb.Client;

  constructor(client: faunadb.Client) {
    this.client = client
  }

  getCollection(name: faunadb.ExprArg) {
    this.scope = q.Collection(name)
    return this
  }

  getIndex(index: faunadb.ExprArg) {
    this.scope = q.Index(index);
    return this
  }

  byRef(ref: faunadb.ExprArg) {
    this.scope = q.Ref(this.scope, ref)
    return this
  }

  matching(value: faunadb.ExprArg = undefined) {
    this.scope = value ? q.Match(this.scope, value) : q.Match(this.scope)
    return this
  }

  get() {
    this.scope = q.Get(this.scope)
    return this
  }

  paginate() {
    this.scope = q.Paginate(this.scope)
    return this;
  }

  all() {
    this.paginate()
    this.scope = q.Map(this.scope, q.Lambda("X", q.Get(q.Var("X"))))
    return this
  }

  execute(options: faunadb.QueryOptions = {}) {
    return this.client.query(this.scope, options);
  }

}
