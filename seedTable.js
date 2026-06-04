import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from "node:path"
import { vinyl } from './data.js'

async function seedTable() {
    const db = await open({
        filename: path.join('database.db'),
        driver: sqlite3.Database
    })

    try {
        await db.exec("BEGIN TRANSACTION")

        for (let product of vinyl) {
            await db.run(`INSERT INTO products (${Object.keys(product)}) VALUES(?,?,?,?,?,?,?)`, Object.values(product))
        }

        await db.exec("COMMIT")
        console.log("all products inserted")
        
    }catch(err) {
        await db.exec("ROLLBACK")
        console.log(`Error inserting data `, err.message)
    } finally {
        db.close()
    }
}

seedTable()

// function testerBeforeSeed() {
//     for (let product of vinyl) {
//         console.log(`INSERT INTO products (${Object.keys(product)}) VALUES(?,?,?,?,?,?,?)`, Object.values(product))
//     }
// }

// testerBeforeSeed()