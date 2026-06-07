import express from 'express'
import cors from 'cors'
import { productsRoute } from './routes/products'
import { authRouter } from './routes/auth'
import session from 'express-session'

const PORT = 8000
const app = express()
const secret = process.env.SPIRAL_SESSION_SECRET || `Jelly-guy-swimgoodbye`

app.use(cors())
app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' 
    }
}))
app.use(express.json())

app.use(express.static('public'))
app.use("/api", productsRoute)
app.use("/api/auth", authRouter)

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`)
})