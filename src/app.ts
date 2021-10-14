import express from 'express';
import { Application } from 'express';
import FaunaDB from './connectors/fauna-db';
import context from './gql/context';
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import schema from './gql/schema'
import depthLimit from 'graphql-depth-limit'
import { snakeCaseFieldResolver } from './gql/middleware/fieldResolver'
import http from 'http';

class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; middleWares: any; controllers: any }) {
    this.app = express();
    const httpServer = http.createServer(this.app);

    this.port = appInit.port;

    const faunaDb = new FaunaDB();
    Promise.all([
      faunaDb.query
        .findByIndex('authentications_by_provider', 'twitch')
        .execute(),
      faunaDb.query
        .findByIndex('authentications_by_provider', 'patreon')
        .execute(),
    ]).then((docResults) => {
      const authContext = context({
        twitchCreds: {
          accessToken: docResults[0].data.accessToken,
          refreshToken: docResults[0].data.refreshToken,
          onTokenRefresh: async (credentials) => {
            const doc = docResults[0];
            const data = {
              uid: doc.data.id,
              provider: 'twitch',
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
              expiresIn: credentials.expiresIn,
              obtainmentTimestamp: credentials.obtainmentTimestamp,
              profile: doc.profile,
            };
            if (doc) {
              await faunaDb.query.update(doc.ref, data).execute();
            }
          },
        },
        patreonCreds: {
          accessToken: docResults[1].data.accessToken,
          refreshToken: docResults[1].data.refreshToken,
          onTokenRefresh: async (credentials) => {
            const doc = docResults[1];
            const data = {
              uid: doc.data.id,
              provider: doc.data.provider,
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
              expiresIn: credentials.expiresIn,
              obtainmentTimestamp: credentials.obtainmentTimestamp,
              profile: doc.profile,
            };

            // Create or Update credentials here
            if (doc) {
              await faunaDb.query.update(doc.ref, data).execute();
            } else {
              await faunaDb.query.create('authentications', data).execute();
            }

            return data
          },
        },
      });

      const server = new ApolloServer({
        schema,
        validationRules: [depthLimit(7)],
        context: authContext ,
        fieldResolver: snakeCaseFieldResolver,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      });

      server.start().then(() => {
        server.applyMiddleware({
          app: this.app,
          path: '/graphql/twitch',
        });
      })

    });

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.assets();
    this.template();
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void;
  }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: {
    forEach: (arg0: (controller: any) => void) => void;
  }) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private assets() {
    this.app.use(express.static('public'));
    this.app.use(express.static('views'));
  }

  private template() {
    this.app.set('view engine', 'pug');
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the ${process.env.HOST}`);
      // console.log(`GQL 🚀 Server ready at ${process.env.HOST}${server.graphqlPath}`)
    });
  }
}

export default App;
