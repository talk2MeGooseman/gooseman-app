
import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import passport from 'passport';
import FaunaDB from 'connectors/fauna-db';

require('dotenv').config();

class PatreonController implements IControllerBase {
  public path = '/auth/patreon';
  public router = express.Router();

  constructor(db: FaunaDB) {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, passport.authenticate('patreon'));
    this.router.get(this.path + '/callback', passport.authenticate('patreon', { failureRedirect: '/' }), this.callback);
  }

  callback = (req: Request, res: Response) => {
    res.render('posts/index', res);
  };
}

export default PatreonController;
