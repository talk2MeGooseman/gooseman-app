"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = tslib_1.__importStar(require("express"));
const http_status_codes_1 = require("http-status-codes");
class PostsController {
    constructor(db) {
        this.path = '/posts';
        this.router = express.Router();
        this.posts = [
            {
                id: 1,
                author: 'Ali GOREN',
                content: 'This is an example post',
                title: 'Hello world!'
            }
        ];
        this.getPost = (req, res) => {
            const id = +req.params.id;
            let result = this.posts.find(post => post.id == id);
            if (!result) {
                res.status(http_status_codes_1.NOT_FOUND).send({
                    'error': http_status_codes_1.getStatusText(http_status_codes_1.NOT_FOUND)
                });
            }
            res.render('posts/index', result);
        };
        this.getAllPosts = async (req, res) => {
            const results = await this.db.query.getIndex('all_customers').matching().all().execute();
            console.log(results);
            res.send(results);
        };
        this.createPost = (req, res) => {
            const post = req.body;
            this.posts.push(post);
            res.status(http_status_codes_1.CREATED).send(this.posts);
        };
        this.db = db;
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.path + '/:id', this.getPost);
        this.router.get(this.path, this.getAllPosts);
        this.router.post(this.path, this.createPost);
    }
}
exports.default = PostsController;
//# sourceMappingURL=posts.controller.js.map