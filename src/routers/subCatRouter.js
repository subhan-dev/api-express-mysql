const conn = require('../connection/index');
const router = require('express').Router();

// add sub_category
router.post('/sub_category', (req, res) => {
    const sql = `insert into sub_category set ?`
    const sql2 = `select nama from sub_category where id = ?`

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

// edit sub_category
router.patch('/sub_category/:id', (req, res) => {
    const sql = `update sub_category set ? where id = '${req.params.id}'`
    const sql2 = `select nama from sub_category where id = '${req.params.id}'`
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

// delete sub_category
router.delete('/sub_category/:id', (req, res) => {
    const sql = `delete from sub_category where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send({
            messege: 'Ok',
            result: result
        })
    })
})

// get sub_category
router.get('/sub_category', (req, res) => {
    const sql = `select * from sub_category`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send({
            messege: 'Ok',
            data: result
        })
    })
})

module.exports = router