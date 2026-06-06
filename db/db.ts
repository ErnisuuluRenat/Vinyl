import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'
import path from 'node:path'

export async function getDBConnection(): Promise<Database> {

const dbPath = path.join('database.db')

 return open({
   filename: dbPath,
   driver: sqlite3.Database
 }) 

} 
