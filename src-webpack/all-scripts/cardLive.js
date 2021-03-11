const elements = require('../views/elements');
const axios = require('axios');
const HOST = 'http://localhost:3000';

// On click, generate the card and send a request:-
elements.downloadImageBtn.addEventListener('click', async (e) => {
    let valuesAsStrings = elements.theValuesElement.innerHTML;

    try {
        const data = await axios.post(`${HOST}/generatePDF`, {
            values: valuesAsStrings,
            studentId: elements.studentId.textContent
        });

        // That means that everything is fine, and we've recieved the download path of the PDF.
        if (data.data.code === 200) {
            
            // Create an <a> tag, hide it, appened it to body and add a HREF attribute:-
            // window.open wasn't able to load resources due to security issues:-
            window.open(`${HOST}/getPDF/${data.data.filename}`, '_blank');

        }
    
        console.log(data);
    } catch (e) {
        console.log(e)
    }
})