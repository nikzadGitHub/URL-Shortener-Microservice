// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nikzad:nikzad123@cluster0.h0hbu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')   
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));

var bodyParser = require("body-parser");

  /** 3) Create and Save a url */
  var urlSchema = new mongoose.Schema({
    url: String,
    short_url: Number,
  });

  var Record = mongoose.model('URL', urlSchema);

// Basic Configuration
// const port = process.env.PORT;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {

  let url = req.body.url;

  let outPut = { error : "Invalid Date" };

  dns.lookup(url, function onLookup(err) {
    if ( ! err == null) {
      console.log('unverified URL')
      res.json(outPut);
    } 
  });
  console.log('verified URL');

  // Generate a shortURL for this address.

  // Store url in mongo db.

  let shortUrl = Math.floor(Math.random() * 1000) + 1;

  var urlRecord = new Record({url: url, short_url: shortUrl});

  urlRecord.save(function(err, data) {
    if (err) return console.error(err);
  });

  // Continue, buling next route.
  outPut = {"original_url":url,"short_url":shortUrl}

  res.json(outPut);
});


app.get('/api/shorturl/:shortUrl?', function(req, res) {

  let shortUrl = req.params.shortUrl;

  console.log("your input", shortUrl);

  // Get the corresponding url.
  Record.find({short_url: shortUrl}, function (err, recordFound) {
    if (err) return console.log(err);
    console.log("found record", recordFound[0].url);

    res.redirect(recordFound[0].url);
  });

});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
