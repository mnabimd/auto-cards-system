const express = require('express');
const {auth} = require('../middleware/loginAuthenticate');
const {checkIfLoggedIn} = require('../middleware/loginAuthenticate');
const router = new express.Router();
const {sendRender} = require('./renderer/renderer');

// Load Core Modules:-
const fs = require('fs');
const path = require('path');

// Settings Path:-
const settingsPath = path.join(__dirname, '../settings/appSettings.json');

router.get('/appSettings', (req, res) => {
    // Load settings
    const theSettings = JSON.parse(fs.readFileSync(settingsPath));

    sendRender('appSettings', res, {
        educationalYear: theSettings.currentEducationalYear
    });
});

router.post('/appSettings', (req, res) => {
    
    const newSettingsJSON = JSON.stringify({currentEducationalYear: req.body.educationalYear});

    // Write and replace this new settings with the old once.
    const newSettings = fs.writeFile(settingsPath, newSettingsJSON, () => {
        // ONCE THE SETTINGS FILE IS UPDATED, SEND THE RESPONSE:-   

        // Now, let's send the new settings to the user:-
        const theSettings = JSON.parse(fs.readFileSync(settingsPath));

        sendRender('appSettings', res, {
            educationalYear: theSettings.currentEducationalYear
        })
    });
    

})

module.exports = router;