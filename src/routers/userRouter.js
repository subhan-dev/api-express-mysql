const conn = require('../connection/index')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const mailVerify = require('../helpers/nodemailer')
// const multer = require('multer')

// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname,'/../..')
const photosdir = path.join(rootdir, '/upload/profileImages')

// const multer = require('multer')
//const upstore = require('../helpers/multer')

const upload = require('../helpers/multer')
// const folder = multer.diskStorage(
//     {
//         destination: function (req, file, cb){
//             cb(null, photosdir)
//         },
//         filename: function (req, file, cb){
//             // Waktu upload, nama field, extension file
//             cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
//         }
//     }
// )

// const upstore = multer(
//     {
//         storage: folder,
//         limits: {
//             fileSize: 1000000 // Byte , default 1MB
//         },
//         fileFilter(req, file, cb) {
//             if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
//                 return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
//             }
    
//             cb(undefined, true)
//         }
//     }
// )

// UPLOAD AVATAR
router.post('/users/avatar/:uname', upload.upstore(upload.photosdir1).single('avatar'), (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}'
                    WHERE username = '${req.params.uname}'`

    conn.query(sql, req.params.uname, (err, result) => {
        if(err) return res.send(err)

        const user = result[0]

        if(!user) return res.send('User not found')

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send({
                message: 'Upload berhasil',
                filename: req.file.filename
            })
        })
    })
})

// ACCESS IMAGE
router.get('/users/avatar/:imageName', (req, res) => {
    // Letak folder photo
    const options = {
        root: photosdir
    }

    // Filename / nama photo
    const fileName = req.params.imageName

    res.sendFile(fileName, options, function(err){
        if(err) return res.send(err)
        
    })

})

// DELETE IMAGE
router.delete('/users/avatar', (req, res)=> {
    const sql = `SELECT * FROM users WHERE username = '${req.body.uname}'`
    const sql2 = `UPDATE users SET avatar = null WHERE username = '${req.body.uname}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        // nama file
        const fileName = result[0].avatar

        // alamat file
        const imgpath = photosdir + '/' + fileName

        // delete image
        fs.unlink(imgpath, (err) => {
            if(err) return res.send(err)

            // ubah jadi null
            conn.query(sql2, (err, result2) => {
                if(err) res.send(err)

                res.send('Delete berhasil')
            })
        })
    })
})


// input user
router.post('/register', (req, res) => {
    const sql = `insert into users set ?`
    const sql2 = `select username, fullname, email from users where id = ?`

    if(req.body.username.includes(' ')) return res.send('Username must not contain spaces')

    if(!isEmail(req.body.email)) return res.send('Email is not valid')

    if(req.body.password.length < 6) return res.send('Minimal length character 6')

    req.body.password = bcrypt.hashSync(req.body.password, 8)

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err.message)

        conn.query(sql2, result.insertId, (err, result) => {
            if(err) return res.send(err.message)

            mailVerify(result[0])
            res.send({
                message: 'Ok',
                data: result[0]
            })
        })
    })
})

// get users
router.get('/users/profile/:uname', (req, res) => {
    const sql = `SELECT username, name, email, avatar
                FROM users WHERE username = ?`

    conn.query(sql, req.params.uname, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if(err) return res.send(err)

        const user = result[0]

        // jika user tidak di temukan
        if(!user) return res.send('User not found')

        res.send({
            message: 'Ok',
            data: user
        })
    })
})

// edit user
router.patch('/users/profile/:uname', (req, res) => {
    const sql = `UPDATE users SET ? WHERE username = '${req.params.uname}'`
    const sql2 = `SELECT username, name ,email 
                    FROM users WHERE username = '${req.params.uname}'`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err)

            res.send({
                message: 'Ok',
                data: result[0]
            })
        })
    })
})

// VERIFY USER
router.get('/users/verify', (req, res) => {
    const sql = `UPDATE users SET verified = true 
                WHERE username = '${req.query.uname}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send('<h1>Verifikasi berhasil</h1>')
    })
})


module.exports = router