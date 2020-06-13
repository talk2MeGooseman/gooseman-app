"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = tslib_1.__importStar(require("express"));
class HomeController {
    constructor() {
        this.path = '/';
        this.router = express.Router();
        this.index = (req, res) => {
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
            ];
            res.render('home/index', { users });
        };
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this.index);
    }
}
exports.default = HomeController;
//# sourceMappingURL=home.controller.js.map