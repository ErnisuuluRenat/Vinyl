import { Request, Response } from "express";
import { getDBConnection } from "../db/db";

type CartItem = {
    productId : string
}

export async function addItemToCart(req: Request, res: Response) : Promise<void> {

    if (!req.session.userId) {
        res.status(401).json({message: "Unauthorized user"})
        return
    }

    const userId = req.session.userId
    const {productId} = req.body as CartItem

    if (!productId || Number.isNaN(parseInt(productId, 10))) {
         res.status(400).json({message: "Invalid product id"})
        return
    }

    try {
        const db = await getDBConnection()

        const itemExists = await db.get('SELECT * from cart_items where user_id = ? and product_id = ?', [userId, productId])

        if(!itemExists) {
            await db.run('insert into cart_items (user_id, product_id) values (?, ?)', [userId, productId])

            console.log('added to cart')

            return
        } else { 
            await db.run('update cart_items set quantity = quantity + ? where product_id = ? and user_id = ?', [1, productId, userId])
        res.status(201).json({message: "Added to cart"})
    }
   } catch(err) {
    if (err instanceof(Error)) {
        console.log('Error adding item to cart: ', err.message)
    } else {
        console.log('Unexpected error: ', err)
    }
   }
}

export async function getCartCount(req: Request, res: Response) : Promise<void> {

}