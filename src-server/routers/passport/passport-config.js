const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const initPassport =  (passport, getUser, getUserById) => {

    const authenticateUser = async (username, password, done) => {
        const user = getUser(username);

        if (user == null) {
            return done(null, false, { message: 'Username/Password incorrect'})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Username/Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new localStrategy({usernameField: 'username'}, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });

};


module.exports = initPassport