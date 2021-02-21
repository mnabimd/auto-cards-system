const express = require('express');
const router = new express.Router();
const {
    auth
} = require('../middleware/loginAuthenticate');
const axios = require('axios');
const {
    sendRender
} = require('./renderer/renderer');
const multer = require('multer');
const btoa = require('btoa');

const upload = multer({});

const fs = require('fs');
const pdf = require('html-pdf');
const path = require('path');
const data = {
    data: {}
};

router.get('/newCard', auth, (req, res) => {
    return sendRender('card', res);
});

router.post('/newCard', auth, async (req, res) => {

    if (!req.body.kankorId) {
        return sendRender('card', res);
    }

    const kankorId = req.body.kankorId;

    // Let's start a request to the 
    const student = await axios.post(`http://localhost:4000/student/${kankorId}`, {
        apiAuth: 'aGiftToMyFriend'
    });

    const studentData = student.data.student;

    if (!studentData) {
        return sendRender('card', res, {
            message: 'No student found!'
        })
    }

    return sendRender('card', res, {
        student: studentData
    })
});

// Live Preview :-
router.get('/cardGenerate', (req, response) => {
    // Let's create the PFD file and once done, let's send it:-

    var html = fs.readFileSync(path.join(__dirname, '../../data/card-template/card.html'), 'utf8');
    var options = {
        base: "file:///C:/Users/Mohammad Nabi/Desktop/Web Projects/Web Development 2021/Auto Card System/data/card-template/",
        width: '216mm',
        height: '345mm',
        quality: "100",
        type: 'pdf'
    };

    pdf.create(html, options).toFile('data/card-generated/card.pdf', function (err, res) {
        if (err) return console.log(err);

        var i = 0;
        i++;

        console.log([res, i])
        response.sendFile(path.join(__dirname, '../../data/card-generated/card.pdf'));
    });


    // This file the generated pdf file by PDF-HTML in data directory in the root.

});


router.get('/cardLive', (req, res) => {
    res.send({
        message: 'Cant be done here, dude!'
    })
});

router.post('/cardLive', upload.single('profilePhoto'), (req, res) => {

    function toBase64(arr) {
        //arr = new Uint8Array(arr) if it's an ArrayBuffer
        return `data:image/png;base64,${btoa(
           arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        )}`;
    };

    const profile = toBase64(req.file.buffer)

    sendRender('cardTemplate', res, {
        student: {
            kankorId: req.body.kankorId,
            name: req.body.name,
            fatherName: req.body.fatherName,
            faculty: req.body.faculty,
            branch: req.body.branch,
            blood: req.body.blood,
            yearOfKankor: req.body.yearOfKankor,
            profile
        }
    });
})



module.exports = router;