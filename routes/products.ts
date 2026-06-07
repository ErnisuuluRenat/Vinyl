import express from 'express'
import {getGenres, getProducts} from '../controllers/productsController'

export const productsRoute = express.Router()

productsRoute.get('/products', getProducts)
productsRoute.get('/products/genres', getGenres)