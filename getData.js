import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function getData() {
    const db = await open({
        filename: path.join('database.db'),
        driver: sqlite3.Database
    })

    try {
        // to secury ourself from sql injections
        const query = 'SELECT * FROM products where year = ?'
        const params = [2003]

        const products = await db.all(query, params)

        console.log(products)
    } catch (err){
        console.log("Error getting the data")
    }
}

getData()