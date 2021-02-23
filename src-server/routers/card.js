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
const pdf = require('html-pdf');
const uniqueString = require('unique-string');

const upload = multer({});

const fs = require('fs');
const path = require('path');

router.get('/newCard', auth, (req, res) => {
    return sendRender('card', res);
});

router.post('/newCard', auth, async (req, res) => {

    if (!req.body.kankorId) {
        return sendRender('card', res);
    }

    const kankorId = req.body.kankorId;

    try {
        // Let's start a request to the 
        const student = await axios.post(`http://localhost:4000/student/${kankorId}`, {
            apiAuth: 'aGiftToMyFriend.S.AB.HALIM'
        });

        const studentData = student.data.student;

        if (!studentData) {
            return sendRender('card', res, {
                message: 'No student found!'
            })
        }

        return sendRender('card', res, {
            student: studentData
        });

    } catch (e) {
        console.log([e, 'Location: Card.js'])
        res.status(500).send({
            error: e
        })
    }

});

router.post('/cardLive', upload.single('profilePhoto'), (req, res) => {

    const toBase64 = (arr) => {
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
});


// Generating PDF and HTML:-

router.post('/generatePDF', async (req, res) => {
    const values = req.body.values

    try {

        let theHtmlTemplate = fs.readFileSync(path.join(__dirname, '../../data/card-template/card.html'), 'utf8');

        let newHtml = theHtmlTemplate.replace('<!-- CODE: MOHAMMDNABI -->', values);

        const newHtmlName = uniqueString().slice(0, 10);
        const newHTML = fs.writeFileSync(path.join(__dirname, `../../data/card-template/${newHtmlName}.html`), newHtml, () => {});

        // Now, let's convert this HTML file to PDF by PhantomJS or HTML_PDF:-
        const readNewHTMLFile = fs.readFileSync(path.join(__dirname, `../../data/card-template/${newHtmlName}.html`), 'utf8');

        var options = {
            base: "file:///C:/Users/Mohammad Nabi/Desktop/Web Projects/Web Development 2021/Auto Card System/data/card-template/",
            width: '216mm',
            height: '344.5mm',
            quality: "100",
            type: 'pdf'
        };

        pdf.create(readNewHTMLFile, options).toFile(`data/card-generated/${newHtmlName}.pdf`, function (err, response) {
            if (err) return console.log(err);
        });

        // Send the response:-
        res.send({
            message: 'Card generated and saved!',
            path: path.join(__dirname, `../../data/card-generated/${newHtmlName}.pdf`)
        });

    } catch (e) {
        console.log([e, 'Location: card.js'])
    }

});



module.exports = router;