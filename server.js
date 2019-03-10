const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const server = http.Server(app)

app.use(bodyParser.json())
app.use('/', express.static(__dirname))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

server.listen(8080, () => {
  console.log('listening on 8080')
})
