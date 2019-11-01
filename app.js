var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fetch = require('node-fetch');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Firestore = require('@google-cloud/firestore');
require('dotenv').config()
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
  projectId: process.env.DB_HOST,
  keyFilename: './keyfile.json',
});

function saveBikes() {
  
    fetch('https://dkw6qugbfeznv.cloudfront.net/')
  .then(function(res) {
    return res.json();}  //examine this solved awaiting promise but is it correct?
  ).then(
    function(json){
     // let zip = json.features[0].properties;
     let bikestations = json.features
     let zip = 
     {
      bikelist: bikestations
     }
     //res.json(zip);
     let bike = Date.now()
     let document = bike.toString();
     let setDoc = db.collection('bikes').doc(document).set(zip);
    //  let setBike = setDoc.set({
    //   id: Date.now()
    // })
      //console.log(json);
    }
  ).catch((err) => {
       console.log('Error saving documents', err);
     });



  db.collection('bikes').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
    //  console.log('**', doc.data());
    console.log('Bikes saved to the db')
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });


  // console.log("Your bike is saved")
}
// set interval to save to db every hour
setInterval(saveBikes, 3600000 )

  db.collection('users').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
       // console.log('Documents saved')
  });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
  
  
// let docRef = db.collection('users').doc('alovelace');

// let setAda = docRef.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1815
// });

app.get('/bikes', function (req, res) {
  db.collection('bikes').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      // fix this each doc is making a call // maybe get one i.e. the most recent
      res.json(doc.data());
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  }); 
})

app.get('/test', function (req, res){
  fetch('https://dkw6qugbfeznv.cloudfront.net/')
.then(function(res) {
  return res.json();}
).then(
  function(json){
    let zip = json.features;
   res.json(zip);
    //console.log(json);
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
