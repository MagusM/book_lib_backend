import express, { NextFunction, Request as ExpressRequest, Response } from 'express';
interface RequestWithSession extends ExpressRequest {
    session: any;
}

// Middleware function that checks for a valid session
const requireSession = (req: RequestWithSession, res: Response, next: NextFunction) => {
    // Check if session exists and is not expired
    if (req.session && req.session.userId && req.session.cookie.expires > Date.now()) {
        // Session is valid, continue with request
        next();
    } else {
        // Session is invalid, redirect to login page
        // todo: res.redirect('/login') ? instead of 401 ... ?
        return res.status(401).send('Session expired or invalid');
    }
};

export default requireSession;
