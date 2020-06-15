import { Request, Response } from 'express'

const ensureAuthenticationMiddleware = (req: Request, resp: Response, next) => {
    if (req.isAuthenticated() || req.path === '/auth/twitch' || req.path === '/auth/twitch/callback' ) {
        console.log('Authenticated')
        return next();
    }
    console.log('Not Authenticated')
    resp.redirect('/auth/twitch');
}

export default ensureAuthenticationMiddleware
