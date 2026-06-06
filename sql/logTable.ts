import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from "node:path"

async function viewAllProducts(): Promise<void> {
    const db = await open({
        filename: path.join('database.db'),
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

viewAllProducts()