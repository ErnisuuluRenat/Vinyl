import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from "node:path"

async function createTable() {
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

async function createTableUsers() {
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

createTableUsers()