const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/login')
};

const checkIfLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    };

    next();
}

module.exports = {auth,checkIfLoggedIn}