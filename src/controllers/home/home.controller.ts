import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from 'interfaces/IControllerBase.interface'
import FaunaDB from 'connectors/fauna-db'

class HomeController implements IControllerBase {
    public path = '/'
    public router = express.Router()

    constructor(db: FaunaDB) {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/', this.index)
    }

    index = (req: Request, res: Response) => {

        const users = [
            {
                id: 1,
                name: 'Eriks'
            },
            {
                id: 2,
                name: 'Burrito'
            },
            {
                id: 3,
                name: 'Time'
            }
        ]

        res.render('home/index', { users })
    }
}

export default HomeController
