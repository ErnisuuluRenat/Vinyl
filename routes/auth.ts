import { registerUser } from "../controllers/authController";
import express from "express"

export const authRouter = express.Router()

authRouter.post("/register", registerUser)