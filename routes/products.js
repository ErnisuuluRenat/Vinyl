import express from 'express'
import {getGenres, getProducts} from '../controllers/productsControllers.js'

export const productsRoute = express.Router()

productsRoute.get('/products', getProducts)
productsRoute.get('/products/genres', getGenres)