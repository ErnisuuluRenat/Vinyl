import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from "node:path"

const pathDir = path.join('database.db')

async function createTable(): Promise<void> {
    const db = await open({
        filename: "database.db",
        driver: sqlite3.Database
    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
        id integer primary key autoincrement, 
        title text not null,
        artist text not null,
        price real not null,
        image text not null,
        year text,
        genre text,
        stock integer
        )
        `)

    await db.close()
    console.log('Table was created')
}

async function createTableUsers() : Promise<void> {
    const db = await open({
        filename: path.join("database.db"),
        driver: sqlite3.Database
    })

    await db.exec(`CREATE TABLE if not exists users(
        id integer primary key autoincrement,
        name text,
        email text unique not null,
        username text unique not null,
        password text not null,
        created_at datetime default current_timestamp
        )`)

    await db.close()
    console.log('Table users was successfully created')
}

async function createTableCart() : Promise<void> {
    const db = await open({
        filename: pathDir,
        driver: sqlite3.Database
    })

    await db.exec(`CREATE TABLE IF NOT EXISTS cart_items (
            id integer primary key autoincrement,
            user_id integer not null,
            product_id integer not null,
            quantity integer not null default 1,
            foreign key (user_id) references users(id),
            foreign key (product_id) references products(id)
        )`)

    await db.close()
    console.log("Cart table was successfully created")
}

createTableCart()