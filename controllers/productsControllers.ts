import { Request, Response } from "express"
import { getDBConnection } from "../db/db"

export async function getGenres(req : Request, res : Response) {

  console.log('genres')

  try {
    const db = await getDBConnection()

    const products = await db.all('SELECT genre FROM products')
    const genres = products.map((product) => product['genre'])

    res.status(200).json([...new Set(genres)])
  } catch(err : unknown) {
    if (err instanceof(Error)) {
      res.status(500).json({error : "Failed to fetch genres", details: err.message})
    } else {
      res.status(500).json({error: "Unexpected error occured:", err})
    }
  }

}

export async function getProducts(req : Request, res: Response) {
    try {
    const db = await getDBConnection()

    
    const {genre, search} = req.query
    let query = "SELECT * from products "
    let params = []

    if (genre && typeof genre === "string") {
      query += ` WHERE genre = ?`
      params.push(genre)
    } else if (search && typeof search === 'string') {
      query += ` WHERE title like ? or artist like ? or genre like ?`

      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    // if (genre) {
    //     query = 'SELECT * from products where genre = ?'
    //     const products = await db.all(query, [genre])
    //     console.log("from genre", products)
    //     res.status(200).json(products)
    //     return
    // }

    const products = await db.all(query, params)
    res.status(200).json(products)

  } catch(err : unknown) {
    if (err instanceof(Error)) {
      res.status(500).json({error : "Failed to fetch genres", details: err.message})
    } else {
      res.status(500).json({error: "Unexpected error occured:", err})
    }
  }
}