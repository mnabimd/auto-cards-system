// Load Routers:-
const renderRouter = require('../routers/render');
const authentication = require('../routers/authenticate');

const routers = (app) => {
    app.use(authentication, renderRouter);
};

module.exports = routers;