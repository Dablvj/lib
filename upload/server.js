const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')
const multerObj = multer({ dest: 'uploads/'}) //上传中间件

app.use(multerObj.any())

app.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html')
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/upload', (req, res, next) => {
    res.send({
        'states':'success'
     })
})

app.listen(9090, () => {
    console.log('server listen 9090')
})
