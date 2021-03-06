// Load express module with `require` directive
var express = require('express');
var app = express();

const path = require('path');
var fs = require('fs');


const menu = path.join(__dirname, 'menu/menu.html')

// Host static files in ~/git/JavaScript-Prototypes/src folder
app.use('/static/', express.static(path.join(__dirname, '')))

// Define request response in root URL (/)
app.get('/', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' })

  fs.createReadStream(menu).pipe(res)
})

// Converter
app.get('/converter', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' })

  fs.createReadStream(menu).pipe(res)

  const file = path.join(__dirname, 'converter/converter.html');
  fs.createReadStream(file).pipe(res)
})

// Free Enterprise
app.get('/free-enterprise', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' })

  fs.createReadStream(menu).pipe(res)

  const file = path.join(__dirname, 'free-enterprise/free-enterprise.html');
  fs.createReadStream(file).pipe(res)
})

// Geocoder
app.get('/geocoder', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' })

  fs.createReadStream(menu).pipe(res)

  const file = path.join(__dirname, 'geocoder/geocoder.html');
  fs.createReadStream(file).pipe(res)
})

// Physics Simulation
app.get('/physics-simulation', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' })

  fs.createReadStream(menu).pipe(res)

  const file = path.join(__dirname, 'physics-simulation/physics-simulation.html');
  fs.createReadStream(file).pipe(res)
})

// Listen on 3000
var port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})