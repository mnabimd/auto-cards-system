const express = require('express');
const {auth} = require('../middleware/loginAuthenticate');
const {checkIfLoggedIn} = require('../middleware/loginAuthenticate');
const router = new express.Router();

router.get('/register', checkIfLoggedIn, (req, res) => {
    // Currently, we don't support register in this

    // res.json({
    //     Code: 405,
    //     Response: 'Registration not allowed!',
    //     Tip: 'Ask admin to create an accout for you.'
    // });
    // return false;

    res.render('register');
});


router.get('/login', checkIfLoggedIn, (req, res) => {
    res.render('login');
});


// 404 Page rendering:-  This one always has to be the last!
// 404 Page Rendering:----------------------------------------------------------------------
/* router.get('*', auth, (req, res) => {
    res.render('404');
});


router.post('*', auth, (req, res) => {
    res.render('404');
}); */
module.exports = router;