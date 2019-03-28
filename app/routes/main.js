
var User = require('../models/user');
const { Payment } = require('../models/payment');
var moment = require('moment');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('pages/index.ejs',{user:req.user}); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('pages/login.ejs', { message: req.flash('loginMessage'),user:req.user }); 
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('pages/signup.ejs', { message: req.flash('signupMessage'),user:req.user });
    });

    // payment section
    app.get('/payment', isLoggedIn, function(req, res) {
        Payment.find({user:req.user._id})
            .then(payments => {
                res.render('pages/payment.ejs', {
                    user : req.user,
                    payments: sortUserPayments(payments),
                    moment: moment
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'unable to get payments' });
              });
    });

    app.get('/users', (req, res) => {
        User.find()
          .then((users) => res.send(users))
          //.catch(errorHandler);
    });
};
 
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function sortUserPayments(payments) {
    return payments.sort(compare);
}

//sort array of payments in ascending order
function compare(a, b){
  if (a.nextPaymentDate > b.nextPaymentDate) return 1;
  if (a.nextPaymentDate < b.nextPaymentDate) return -1;
  return 0;
}