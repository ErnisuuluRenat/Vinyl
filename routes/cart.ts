import express from 'express'
import { addItemToCart } from '../controllers/cartController'

export const cartRouter = express.Router()

cartRouter.post('/add', addItemToCart)