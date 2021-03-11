const fs = require('fs');
const path = require('path');
const express = require('express');
const router = new express.Router();
const {auth} = require('../middleware/loginAuthenticate');
const axios = require('axios');
const {sendRender} = require('./renderer/renderer');
const multer = require('multer');
const btoa = require('btoa');
const pdf = require('html-pdf');
const uniqueString = require('unique-string');
const {toArabic} = require('arabic-digits');

const upload = multer({});

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
        const student = await axios.post(`${process.env.DB_HOST}/student/${kankorId}`, {
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
        });

    } catch (e) {
        console.log([e, 'Location: Card.js'])
        res.status(500).send({
            error: e
        })
    }

});

// Card Live Preview
router.post('/cardLive', upload.single('profilePhoto'), (req, res) => {

    // This function will return the base64 of req.file.buffer:-
    const toBase64 = (arr) => {
        //arr = new Uint8Array(arr) if it's an ArrayBuffer
        return `data:image/png;base64,${btoa(
           arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        )}`;
    };

    const profile = toBase64(req.file.buffer);


    // We'll fetch the DB id wihout the Kankor Id:-
    const dbIdWithoutKankorId = req.body._id.slice(0, 8);

    // Rightnow, we'll filter facultyWithTitle e.g : محصل او محصله and faculty Name:-
    const facultyFilter = (faculty, genderInDb) => {
        // Gender
        let gender, title;
        if (genderInDb === 'نارینه') {gender = 'male'; title = 'محصل'} else {gender = 'female'; title = 'محصله'};

        if (faculty === 'ښوونه او روزنه') {
            faculty = 'ښووني او روزني'
        } else if (faculty === 'حقوق او سیاسی علوم') {
            faculty = 'حقوق او سیاسي علومو'
        } else if (faculty === 'عامه اداره او پالیسی') {
            faculty = 'عامه ادارې او پالیسي'
        } else if (faculty === 'ژبی او ادبیات') {
            faculty = 'ژبو او ادبیاتو'
        }

        return 'د ' + faculty + ' پوهنځي ' + title;
    }; 

    sendRender('cardTemplate', res, {
        student: {
            kankorId: req.body.kankorId,
            name: req.body.name,
            eName: req.body.eName,
            fatherName: req.body.fatherName,
            faculty: facultyFilter(req.body.faculty, req.body.gender),
            branch: req.body.branch,
            blood: req.body.blood,
            yearOfKankor: toArabic(req.body.yearOfKankor),
            _id: dbIdWithoutKankorId,
            profile     
        }
    });
});


// Generating PDF and HTML:-

router.post('/generatePDF', async (req, res) => {
    const values = req.body.values
    const kankorId = req.body.studentId

    try {
        
        let theHtmlTemplate = fs.readFileSync(path.join(__dirname, '../../data/card-template/card.html'), 'utf8');

        let newHtml = theHtmlTemplate.replace('<!-- CODE: MOHAMMDNABI -->', values);

        const newHtmlName = `${kankorId}_${uniqueString().slice(0, 6).toUpperCase()}`;

        // This will write/save the new HTML template to the specified path. 
        const newHTML = fs.writeFileSync(path.join(__dirname, `../../data/card-template/${newHtmlName}.html`), newHtml, () => {});

        // Now, let's convert this HTML file to PDF by PhantomJS or HTML_PDF:-
        const readNewHTMLFile = fs.readFileSync(path.join(__dirname, `../../data/card-template/${newHtmlName}.html`), 'utf8');

        const base = path.join(__dirname, '../../data/card-template/')

        var options = {
            base: `file:///${base}/`,
            width: '216mm',
            height: '344.5mm',
            quality: "100",
            type: 'pdf'
        };

        // Load the settings file and get the current Kankor Year:-
        const theSettings = fs.readFileSync(path.join(__dirname, '../settings/appSettings.json'));
        const currentKankorYear = JSON.parse(theSettings).currentEducationalYear;

        // Before generating the card, first let's send a request to the DB to update the card status:-
        const cardStatusInDB = await axios.post(`${process.env.DB_HOST}/studentCard`, {
            kankorId,
            year: currentKankorYear
        });
        
        if (cardStatusInDB.data.code === 500) {
            throw 'Card not saved!';
        }

        pdf.create(readNewHTMLFile, options).toFile(`data/card-generated/${newHtmlName}.pdf`, function (err, response) {
            if (err) {
                console.log(err);
                
                return res.send(['Card Generation Failed @ card.js:148', err]) 
            }


            // Send the response when the generation is done!:-
            res.send({
                message: 'Card generated and saved!',
                filename: newHtmlName,
                code: 200
            });

        });


    } catch (e) {
        console.log([e, 'Location: card.js'])
    }

});

// GET Generated File through :-
router.get('/getPDF/:file', (req, res) => {
    const dir = path.join(__dirname, `../../data/card-generated/${req.params.file}.pdf`);

    res.sendFile(dir);
});


module.exports = router;