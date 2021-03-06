

module.exports = function(app, passport) {

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/payment', // redirect to the secure payment section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/payment', // redirect to the secure payment section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}