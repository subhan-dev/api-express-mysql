const express = require('express')
const cors = require('cors')

const userRouter = require('./routers/userRouter')
const brandRouter = require('./routers/brandRouter')
const productRouter = require('./routers/productRouter') 
const  productImgRouter = require('./routers/productImgRouter')

const app = express()
const port = process.env.port || 2019

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(brandRouter)
app.use(productRouter)
app.use(productImgRouter)

app.get('/', (req, res) => {
    res.send('<h1> Selamat Datang </h1>')
})

app.listen(port, () => {
    console.log('Berhasil Running di_ ' + port);
})