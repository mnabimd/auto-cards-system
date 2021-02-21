// Load Routers:-
const renderRouter = require('../routers/render');
const authentication = require('../routers/authenticate');
const cardRouter = require('../routers/card');

const routers = (app) => {
    app.use(authentication, cardRouter, renderRouter);
};

module.exports = routers;