// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
// DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/bill-app';
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(express.static('public'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/main')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes/auth')(app, passport);
const paymentRouter = require('./app/routes/payment');
app.use('/payments', paymentRouter);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


let server;

// this function connects to our database, then starts the server
// function runServer(databaseUrl, port) {
//   return new Promise((resolve, reject) => {
//     mongoose.connect(databaseUrl, err => {
//       if (err) {
//         return reject(err);
//       }
//       server = app.listen(port, () => {
//         console.log(`Your app is listening on port ${port}`);
//         resolve();
//       })
//         .on('error', err => {
//           mongoose.disconnect();
//           reject(err);
//         });
//     });
//   });
// }

function runServer(port) {
  return new Promise((resolve, reject) => {
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
// if (require.main === module) {
//   runServer(DATABASE_URL).catch(err => console.error(err));
// }

module.exports = { runServer, app, closeServer };