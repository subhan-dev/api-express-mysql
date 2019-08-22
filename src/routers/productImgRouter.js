const conn = require('../connection/index');
const router = require('express').Router();
const upload = require('../helpers/multer')
// input image

router.post('/product-images', upload.upstore(upload.photosdir3).array('photoss', 4), (req, res) => {
    // const sql = `insert into product_images set ?`
    const sql = 'INSERT INTO product_images (images, product_id) VALUES ?'
                // insert into brand set ?
    const sql2 = `select images, product_id from product_id where id = ?`

    const {
        product_id
    } = req.body
    let data = []
    for(let i = 0; i < req.files.length; i++) {
        data.push([req.files[i].filename, product_id])
    }
    console.log(data)
    conn.query(sql, [data], (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, product_id, (err, result) => {
            if(err) return res.send(err)

            res.send({
                message: 'Ok',
                data: result
            })
        })
    })
})

module.exports = router