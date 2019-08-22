const conn = require('../connection/index');
const router = require('express').Router();

// add products
router.post('/products', (req, res) => {
    const sql = `insert into products set ?`
    const sql2 = `select * from products where id = ?`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err)
            res.send({
                messege: 'Ok',
                data: result2[0]
            })
        })
    })
})

// edit products
router.patch('/products/:id', (req, res) => {
    const sql = `update products set ? where id = '${req.params.id}'`
    const sql2 = `select * from products where id = '${req.params.id}'`
    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send({
                messege: 'Ok',
                data: result2[0]
            })
        })
    })
})

// delete products
router.delete('/products/:id', (req, res) => {
    const sql = `delete from products where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send({
            messege: 'Ok',
            result: result
        })
    })
})

// get products
router.get('/products', (req, res) => {
    const sql = `select * from products`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send({
            messege: 'Ok',
            data: result
        })
    })
})

module.exports = router