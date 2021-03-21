const express = require('express');
const router = new express.Router();
const {auth} = require('../middleware/loginAuthenticate');
const {sendRender} = require('../routers/renderer/renderer');
const axios = require('axios');

router.get('/', auth, (req, res) => {
    sendRender('index', res, {
        user: 'Mohammad Nabi'
    })
});

router.post('/dashboard', auth, async (req, res) => {
    try {

        const data = await axios.post(`${process.env.DB_HOST}/cardDashboard`, {
            apiAuth: process.env.API_AUTH,
            year: req.body.year
        }); 
    
        const statistics = data.data;
    
        if (!statistics) {
            res.send({
                code: 500,
                message: 'No response from DB'
            });
        }

        res.send({
            code: 200,
            data: statistics
        });

    } catch (e) {
        res.send({
            code: 500,
            message: 'Error @ Routers > dashboard.js'
        })
    }

});



module.exports = router;