import { Request, Response } from "express";
import validator from "validator"
import { getDBConnection } from "../db/db";

type AuthFields = {
    name : string
    email : string
    username: string
    password: string
}

export async function registerUser(req : Request, res : Response): Promise<void> {
    console.log("Req body", req.body)

    let {name, email, username, password} : AuthFields = req.body

    const regex : RegExp = new RegExp("^[a-zA-Z0-9_-]{1,20}$")

    username = username?.trim()
    name = name?.trim()
    email = email?.trim()

    if (!username || !email || !password || !name) {
        res.status(400).json({error: "All fields are required"})
        return
    }
    
    if (!validator.isEmail(email) || !regex.test(username)){
        res.status(400).json({ error: "Invalid email or username" })
        return
    }
    
    try {
        const db = await getDBConnection()

        const user = await db.get(`SELECT * from USERS where username = ? OR email = ?`, [username, email])

        if (user === undefined) {
            await db.run(`INSERT INTO USERS (name, email, username, password) VALUES (?, ?, ?, ?)`, [name, email, username, password])
            res.status(201).json({ message: 'User registered'})
            return
        } else {
            res.status(400).json({error: "Email or username already in use"})
        }

    }catch(err) {
        if(err instanceof(Error)) {
            console.log(`Registration Error`, err.message)
            res.status(500).json({error: "Registration failed. Please try again."})
        }
    }
}
