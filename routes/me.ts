import express from "express"
import { getCurrentUser } from "../controllers/meController"

export const meRouter = express.Router()

meRouter.get('/', getCurrentUser)