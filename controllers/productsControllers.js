import { getDBConnection } from "../db/db.js"

export async function getGenres(req, res) {

  console.log('genres')

  try {
    const db = await getDBConnection()

    const products = await db.all('SELECT genre FROM products')
    const genres = products.map((product) => product['genre'])

    res.status(200).json([...new Set(genres)])
  } catch(err) {
    res.status(500).json({error : "Failed to fetch genres", details: err.message})
  }

}

export async function getProducts(req, res) {
    try {
    const db = await getDBConnection()

    
    const {genre, search} = req.query
    let query = "SELECT * from products "
    let params = []

    if (genre) {
      query += ` WHERE genre = ?`
      params.push(genre)
    } else if (search) {
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

  } catch(err) {
    res.status(500).json({error : "Failed to fetch products", details: err.message})
  }

  console.log('products')

}