const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {checkIfLoggedIn} = require('../middleware/loginAuthenticate');
const initPassport = require('./passport/passport-config');

// const User = require('../db/models/User');

const router = new express.Router();

// User and Password Middleware
// As this application doesn't support DB, so we'll save the users into a json file.

const users = require('../db/users.json').users;
// Call the initPassport from passport-config:-
initPassport(passport, 
    username => users.find(user => user.username === username), 
    id => users.find(user => {
        // Return the user so it will be deseralized in passport.authenticate function.

        return user.id === id
    })
);

router.post('/register', checkIfLoggedIn, async (req, res) => {
    try { 
        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        users.push({
            id: new Date().toString(),
            username: req.body.username,
            password: hashedPassword
        });

        res.redirect('/login')
    } catch (e) {
        res.redirect('/register')
    }
});


router.post('/login', checkIfLoggedIn, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login', 
    failureFlash: true
}));

router.delete('/logout', (req, res) => {
    
    // Here, we'll remove the user which will him/her self out of the session. We can access the user from req.user:-

    // const userIndex = users.findIndex(user => user.id === req.user.id);
    // users.splice(userIndex, 1);

    req.logOut();
    res.redirect('/login')
})


module.exports = router;