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

}

class FaunaDBQuery {
  scope: faunadb.Expr;

  client: faunadb.Client;

  constructor(client: faunadb.Client) {
    this.client = client;
  }

  getCollection(name: faunadb.ExprArg) {
    this.scope = q.Collection(name);
    return this;
  }

  getIndex(index: faunadb.ExprArg) {
    this.scope = q.Index(index);
    return this;
  }

  byRef(ref: faunadb.ExprArg) {
    this.scope = q.Ref(this.scope, ref);
    return this;
  }

  matching(value: faunadb.ExprArg = undefined) {
    this.scope = value ? q.Match(this.scope, value) : q.Match(this.scope);
    return this;
  }

  get(_: any) {
    this.scope = q.Get(this.scope);
    return this;
  }

  paginate(_this?: this) {
    this.scope = q.Paginate(this.scope);
    return this;
  }

  find(collection: faunadb.ExprArg, ref: faunadb.ExprArg) {
    this.scope = q.Ref(q.Collection(collection), ref)
    return this
  }

  findByIndex(index: faunadb.ExprArg, value: faunadb.ExprArg) {
    this.scope = q.Get(
      q.Match(q.Index(index), value)
    )

    return this
  }

  all(index: faunadb.ExprArg) {
    this.getIndex(index).matching().paginate();
    this.scope = q.Map(this.scope, q.Lambda('X', q.Get(q.Var('X'))));
    return this;
  }

  create(collection: faunadb.ExprArg, data: object) {
    this.scope = q.Create(q.Collection(collection), {
      data,
    });

    return this;
  }

  update(ref: faunadb.ExprArg, data: object) {
    this.scope = q.Update(ref, { data });
    return this;
  }

  execute(options: faunadb.QueryOptions = {}): Promise<any> {
    if (!this.scope) throw new Error("Construct a query");

    return this.client.query(this.scope, options).catch((err) => { console.log(err) });
  }
}
