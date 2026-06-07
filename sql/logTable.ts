import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from "node:path"

const pathDir = path.join("database.db")

async function viewAllProducts(): Promise<void> {
    const db = await open({
        filename: pathDir,
        driver: sqlite3.Database
    })
    try{
        const products = await db.all(`select * from products`)
        const displayItems = products.map(({id, title, artist, year, stock}) => {return {id, title,artist, year, stock}})
        console.table(displayItems)
    }catch (err){
        if (err instanceof(Error))
        console.log(`Error while fetching products `, err.message)
        else {
            console.log(`Unexpected error occured:`, err)
        }
    }finally{
        db.close()
    }
}

async function viewAllUsers(): Promise<void> {
    const db = await open({
        filename: pathDir,
        driver: sqlite3.Database
    })

    try {
        const users = await db.all(`SELECT * FROM users`)
        console.table(users)
    } catch(err) {
        if (err instanceof(Error)) {
            console.log(`Error appeared while fetching users`, err.message)
        } else {
            console.log(`Unexpected error occured`, err)
        }
    }
    finally {
        db.close()
    }
}


viewAllUsers()