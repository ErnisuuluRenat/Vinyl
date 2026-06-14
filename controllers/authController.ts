import { Request, Response } from "express";
import validator from "validator"
import { getDBConnection } from "../db/db";
import bcrypt from "bcryptjs";
import { RegisterUserDto } from "../dto/register_user.dto";
import { LoginUserDto, UserCredentials } from "../dto/login.dto";

declare module 'express-session' {
    interface SessionData {
        userId : number
    }
}


export async function registerUser(req : Request<{}, {}, RegisterUserDto>, res : Response): Promise<void> {
    console.log("Req body", req.body)
    // Now req body is expected to be RegisterUserDto
    let {name, email, username, password}  = req.body

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

    const hashedPassword: string = await bcrypt.hash(password, 10) 
    try {
        const db = await getDBConnection()

        const user = await db.get(`SELECT * from USERS where username = ? OR email = ?`, [username, email])

        if (user === undefined) {
            const result = await db.run(`INSERT INTO USERS (name, email, username, password) VALUES (?, ?, ?, ?)`, [name, email, username, hashedPassword])

            req.session.userId = result.lastID
            res.status(201).json({ message: 'User registered'})
            return
        } else {
            res.status(400).json({error: "Email or username already in use"})
        }

    }catch(err) {
        if(err instanceof(Error)) {
            console.log(`Registration Error`, err.message)
            res.status(500).json({error: "Registration failed. Please try again."})
        } else {
            console.log(`Unexpected error occured: `, err)
        }
    }
}

export async function loginUser(req: Request<{}, {}, LoginUserDto>, res: Response): Promise<void> {
    try{
        const db = await getDBConnection()
        const {username, password} = req.body

        if (!username || !password) {
            res.status(400).json({error: "All fields are required"})
            return
        }

        const user:  UserCredentials | undefined = await db.get('SELECT password, id from users where username = ?', [username])

        if (user === undefined) {
            res.status(401).json({error: "Invalid credentials"})
            return
        }

        const compare = await bcrypt.compare(password, user.password)

        if (!compare) {
            res.status(400).json({error: "Invalid credentials"})
            return
        }
        req.session.userId = user.id
        
        res.status(200).json({message: 'Logged in'})
    }

    catch(err) {
        if (err instanceof(Error)) {
            console.log("LoginUser error: ", err.message)
            res.status(500).json({error: "Log in failed"})
        } else{
            console.log('Unexpected error occured ', err)
        }
    }
}

export async function logoutUser(req : Request, res : Response): Promise<void> {
    try {

        req.session.destroy(() => {
            res.json({message: 'Logged out'})
        })

    } catch(err) {
        if (err instanceof(Error)) {
            console.log("Logout error: ", err)
        } else {
            console.log("Unexpected error: ", err)
        }
     }
}