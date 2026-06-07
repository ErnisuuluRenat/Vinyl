import express from 'express'
import cors from 'cors'
import { productsRoute } from './routes/products'
import { authRouter } from './routes/auth'

const PORT = 8000
const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static('public'))
app.use("/api", productsRoute)
app.use("/api/auth", authRouter)

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`)
})