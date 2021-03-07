const express = require('express');
const app = express();
const path = require('path');
const appUse = require('./settings/use');
const appRouters = require('./settings/routers');

const PORT = process.env.PORT || 3000;

// View Engine and Serving Public Folder:-
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));
app.set('view engine', 'ejs');

// Settings -> Use:-
appUse(app);
appRouters(app);

// Global Path for all scripts:-
global.mainDir = path.resolve('./'); // :- e.g AUTO CARD SYSTEM

app.listen(PORT, () => {
    console.log(`App has been started on PORT ${PORT}`);
});