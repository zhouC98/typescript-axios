const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const multipart = require('connect-multiparty')
const path = require('path')
const atob = require('atob')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))
app.use(multipart({upload: path.resolve(__dirname, 'upload-file')}))
app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()

router.post('/more/upload', function(req, res) {
  console.log(req.body, req.files)
  res.end('upload success!')
})

router.post('/more/post', function(req, res) {
  const auth = req.headers.authorization
  const [type, credentials] = auth.split(' ')
  console.log(atob(credentials))

  const [username, password] = atob(credentials).split(':')
  if(type === 'Basic' && username === 'Yee' && password === '123456'){
    res.json(req.body)
  } else {
    res.end('UnAuthorization')
  }
})

router.get('/simple/get',function(req, res) {
  res.json({
    msg:'hello world'
  })
})

router.get('/base/get',function(req, res) {
  res.json(req.query)
})

router.post('/base/post',function(req, res) {
  res.json(req.body)
})

router.post('/base/buffer',function(req, res) {
  let msg = []
  req.on('data',chunk=>{
    if(chunk) msg.push(chunk)
  })
  req.on('end',()=>{
    let buf= Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})



router.get('/error/get',function(req,res) {
  if(Math.random() > .5){
    res.json({
      msg:'hello world'
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout',function(req,res) {
  setTimeout(()=>{
    res.json({
      msg:'hello world'
    })
  },3000)
})

router.get('/interceptor/get',function(req,res) {
  res.json({
    msg:'hello13'
  })
})

router.get('/cancel/get',function(req,res) {
  res.json({
    msg:'hello13'
  })
})
router.post('/cancel/post',function(req, res) {
  res.json(req.body)
})


router.post('/config/post',function(req, res) {
  res.json(req.body)
})

app.use(router)

const port = process.env.PORT || 5000
module.exports = app.listen(port,()=>{
  console.log(`Serve listening on http://localhost:${port}, Ctrl+C to stop`)
})
