import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import {productsRouter} from './routes/products-router';
import {addressesRouter} from './routes/addresses-router';

// create express app
export const app = express()
const port = process.env.PORT || 3001


// create middlewares
const parserMiddleware = bodyParser.json()
app.use(parserMiddleware)

app.use('/products', productsRouter)
app.use('/addresses', addressesRouter)



// start app (listen port)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})