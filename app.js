var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fetch = require('node-fetch');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Firestore = require('@google-cloud/firestore');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


const db = new Firestore({
  projectId: 'spatial-climate-257521',
  keyFilename: './keyfile.json',
});

let docRef = db.collection('users').doc('alovelace');

let setAda = docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});
  


app.get('/test', function (req, res){
  fetch('https://dkw6qugbfeznv.cloudfront.net/')
.then(function(res) {
  return res.json();}
).then(
  function(json){
    let zip = json.features[0].properties;
  //  let zipped = json.features.forEach(myFunction);
    // function myFunction(item, index){
    //  let zips =  zipped.properties.item;
    //  return zips
    // }
    res.json(zip);
    console.log(json);
  }
)
})
  
  

app.get('/path', function (req, res) {
  res.send("This page is functional");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
