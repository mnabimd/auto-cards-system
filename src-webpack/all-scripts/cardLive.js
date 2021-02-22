const elements = require('../views/elements');
const axios = require('axios');


elements.downloadImageBtn.addEventListener('click', async (e) => {
    let valuesAsStrings = elements.theValuesElement.innerHTML;

    try {
        const data = await axios.post('http://localhost:3000/generatePDF', {
            values: valuesAsStrings
        });
    
        console.log(data);
    } catch (e) {
        console.log(e)
    }
})