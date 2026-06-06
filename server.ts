import express from 'express'
import cors from 'cors'
import { productsRoute } from './routes/products'

const PORT = 8000
const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static('public'))
app.use("/api", productsRoute)

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`)
})