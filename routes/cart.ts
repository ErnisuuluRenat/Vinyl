import express from 'express'
import { addItemToCart, getCartCount } from '../controllers/cartController'

export const cartRouter = express.Router()

cartRouter.post('/add', addItemToCart)
cartRouter.get('/cart-count', getCartCount)