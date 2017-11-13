
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

mongoose.connect('mongodb://localhost/dogdashboard');

var DogSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 2},
  age: {type: String, required: true}
});

var Dog = mongoose.model('dogs', DogSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  Dog.find({}, function (err, dogs) {
    if (err){
      console.log(err);
    }
    res.render('index', { dogs: dogs });
  });
});


app.get('/dogs/new', function(req, res) {
  res.render('add_dog.ejs');
});

app.post('/dogs', function(req, res) {
  Dog.create(req.body, function(err) {
    if (err) { console.log(err); }
    res.redirect('/');
  });
});

app.get('/dogs/edit/:id', function(req, res) {
  Dog.find({ _id: req.params.id }, function(err, response) {
    if (err){
      console.log(err);
    }
    res.render('edit.ejs', {dog: response[0]});
  });
});

app.get('/dogs/:id', function(req, res) {
  Dog.find({ _id: req.params.id}, function(err,response) {
    if(err){
      console.log(err);
    }
    res.render('show', {dog: response[0] });
  });
});

app.post('/dogs/:id', function(req, res) {
  Dog.update({ _id: req.params.id}, req.body, function(err, result) {
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});


app.post('/dogs/destroy/:id', function(req, res) {
  Dog.remove({ _id: req.params.id}, function(err, result) {
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});


app.listen(8000, function() {
    console.log("listening on port 8000");
});
