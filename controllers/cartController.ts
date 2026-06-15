import { Request, Response } from "express";
import { getDBConnection } from "../db/db";
import { CartAllDto, CartProductIdDto, CartAddItemDto } from "../dto/cart.dto";
import { MessageDto, ErrorDto } from "../dto/common.dto";


type CartCount = {
    total : number
}

type ItemParams = {
    itemId: string
}

export async function getAll(req : Request<{}, {items: CartAllDto[] | MessageDto | ErrorDto }, {}>, res: Response): Promise<void> {
    if (!req.session.userId) {
        res.status(401).json({message: "Unauthorized user"})
        return
    }

    try {
        const db = await getDBConnection()

    // const items : cartItem[] = await db.all('select * from cart_items')

    // const itemsId = items.map((item) => item.product_id)
    // const placeholders = itemsId.map(() => '?').join(', ')

        const items = await db.all('select cart_items.id as cartItemId, cart_items.quantity, products.title, products.artist, products.price from cart_items join products on cart_items.product_id = products.id where cart_items.user_id = ?', [req.session.userId])

        res.status(200).json({items: items})
    }catch(err) {
        if (err instanceof(Error)) {
            console.log('Get all cart items error: ', err.message)
            res.status(500).json({error: `Get all cart items error ${err.message}`})
        } else {
            console.log('Unexpected error: ', err)
            res.status(500).json({error: "Unexpected error occurred"})
        }
    }
}

export async function addItemToCart(req: Request<{},CartAddItemDto , CartProductIdDto>, res: Response) : Promise<void> {

    if (!req.session.userId) {
        res.status(401).json({message: "Unauthorized user"})
        return
    }

    const userId = req.session.userId
    const {productId} = req.body

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
            res.status(201).json({message: "Added to cart"})
            return
        } else { 
            await db.run('update cart_items set quantity = quantity + ? where product_id = ? and user_id = ?', [1, productId, userId])
        res.status(201).json({message: "Added to cart"})
    }
   } catch(err) {
    if (err instanceof(Error)) {
        console.log('Error adding item to cart: ', err.message)
        res.status(500).json({error: err.message})
    } else {
        console.log('Unexpected error: ', err)
        res.status(500).json({error: "Unexpected error occurred"})
    }
   }
}

export async function getCartCount(req: Request, res: Response) : Promise<void> {
    const db = await getDBConnection()

    if (!req.session.userId) {
        res.status(401).json({message: "Unauthorized user"})
        return
    }

    const userId = req.session.userId

    try {
        const result : CartCount | undefined = await db.get(`SELECT SUM(quantity) as total from cart_items where user_id = ? `, [userId])

        res.status(200).json({totalItems: result?.total || 0})
    } catch(err) {
        if (err instanceof(Error)) {
            console.log('Get cart count error: ', err.message)
        } else {
            console.log('Unexpected error: ', err)
        }
    }

}

export async function deleteItem(req: Request, res: Response) : Promise<void> {
    try {
        const db = await getDBConnection()

        if (!req.session.userId) {
            res.status(401).json({message: "Unauthorized user"})
            return
        }

        const {itemId} = req.params as ItemParams

        if (!itemId || Number.isNaN(parseInt(itemId, 10))) {
            res.status(400).json({ error: 'Invalid item ID' })
            return
        }

        const itemExists = await db.get('Select quantity from cart_items where id = ? and user_id = ?', [itemId, req.session.userId])

        if(itemExists) {
            await db.run('DELETE from cart_items where id = ?', [itemId])
            res.status(204).send()
            return
        } else {
            res.status(400).json({ error: 'Invalid item ID' })
        }
        
    } catch(err) {
        if (err instanceof(Error)) {
            console.log("Delete item error: ", err.message)
        } else {
            console.log("Unexpected error: ", err)
        }
    } 
}

export async function deleteAll(req: Request, res: Response) : Promise<void>{
    try {
        const db = await getDBConnection()

        if (!req.session.userId) {
            res.status(401).json({message: "Unauthorized user"})
            return
        }

        await db.run(`DELETE FROM cart_items where user_id = ?`, [req.session.userId])
        res.status(204).send()

    } catch(err) {
        if (err instanceof(Error)) {
            console.log('Delete all error: ', err.message)
        } else {
            console.log('Unexpected error: ', err)
        }
    }
}