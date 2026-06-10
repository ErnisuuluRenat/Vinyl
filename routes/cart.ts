import express from 'express'
import { addItemToCart, getCartCount, getAll, deleteItem, deleteAll } from '../controllers/cartController'

export const cartRouter = express.Router()

cartRouter.post('/add', addItemToCart)
cartRouter.get('/cart-count', getCartCount)
cartRouter.get('/', getAll)
cartRouter.delete('/all', deleteAll)
cartRouter.delete('/:itemId', deleteItem)