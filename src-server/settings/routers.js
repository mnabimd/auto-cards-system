// Load Routers:-
const renderRouter = require('../routers/render');
const authentication = require('../routers/authenticate');
const cardRouter = require('../routers/card');
const appSettings = require('../routers/appSettings');

const routers = (app) => {
    app.use(authentication, cardRouter, renderRouter, appSettings);
};

module.exports = routers;