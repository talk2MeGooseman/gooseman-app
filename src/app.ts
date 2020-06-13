import express from 'express'
import { Application } from 'express'

import { ApolloServer, gql } from 'apollo-server-express';
import schema from './graphql/schema'
import depthLimit from 'graphql-depth-limit'
import TwitchClient from 'twitch';
import TwitchCredentials from './constants/twitch';

const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)],
    context: async () => ({
      twitchClient: TwitchClient.withClientCredentials(TwitchCredentials.clientId, TwitchCredentials.clientSecret),
    }),
  });

class App {
    public app: Application
    public port: number

    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port

        server.applyMiddleware({ app: this.app });

        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        this.assets()
        this.template()
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    private assets() {
        this.app.use(express.static('public'))
        this.app.use(express.static('views'))
    }

    private template() {
        this.app.set('view engine', 'pug')
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
            console.log(`GQL 🚀 Server ready at http://localhost:${this.port}${server.graphqlPath}`)
        })
    }
}

export default App
