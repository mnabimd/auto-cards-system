const express = require('express');

// Load Authentication Packages:-
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const passport = require('passport');

const cors = require('cors');

const useModules = (app) => {
    // Authentication Settings:-
    app.use(flash());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('_method'));

    // Incoming Requests and Cors Policy:-
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
};

module.exports = useModules;