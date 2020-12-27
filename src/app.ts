import express from 'express'
import { Application } from 'express'
import { createServer } from "./lib/graphql-twitch/src/express-server"
import FaunaDB from './connectors/fauna-db';
import context from './lib/graphql-twitch/src/context';

class App {
    public app: Application
    public port: number


    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port

        const faunaDb = new FaunaDB();
        Promise.all([
            faunaDb.query.findByIndex('authentications_by_provider', 'twitch').execute(),
            faunaDb.query.findByIndex('authentications_by_provider', 'patreon').execute(),
        ]).then((docResults) => {
            const authContext = context({
                accessToken: docResults[0].data.accessToken,
                refreshToken: docResults[0].data.refreshToken,
                patreonCreds: {
                    accessToken: docResults[1].data.accessToken,
                    refreshToken: docResults[1].data.refreshToken
                }
            });

            const server = createServer(authContext);
            server.applyMiddleware({
                app: this.app,
                path: '/graphql/twitch'
            });
        })

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
            console.log(`App listening on the ${process.env.HOST}`)
            // console.log(`GQL 🚀 Server ready at ${process.env.HOST}${server.graphqlPath}`)
        })
    }
}

export default App
