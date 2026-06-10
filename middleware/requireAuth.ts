import { NextFunction, Request, Response } from "express";

export async function requireAuth(req: Request, res : Response, next : NextFunction) {
    if (!req.session.userId) {
        console.log('access has been blocked')
        res.status(401).json({error: "Unauthorized"})
    }

    next()
}