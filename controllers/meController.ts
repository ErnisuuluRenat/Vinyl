import { Request, Response } from "express";
import { getDBConnection } from "../db/db";

type Username = {
    username: string
}

export async function getCurrentUser(req: Request, res:Response): Promise<void> {
    try {
        const db = await getDBConnection()

        if (!req.session.userId) {
            res.status(401).json({isLoggedIn: false})
            return
        }

        const user: Username | undefined = await db.get('SELECT username from users where id = ?', [req.session.userId])    
        
        if (!user) {
            res.status(400).json({isLoggedIn: false, message: "Error occured with db"})
            return
        }

        res.status(200).json({isLoggedIn: true, name : user.username})

    }catch(err) {
        if (err instanceof(Error)) {
            console.log("getCurrentUser error: ", err)
        }
    }
}