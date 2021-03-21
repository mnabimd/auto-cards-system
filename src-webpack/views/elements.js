const cardLiveElements = {
    downloadImageBtn: document.getElementById('download-btn'),
    formImage: document.getElementById('form-image'),
    theValuesElement: document.getElementById('values'),
    studentId: document.getElementById('id-value')
};

const dashboard = {
    facultiesChart: document.getElementById('facultiesChart'),
    deptsSlider: document.getElementById('departments-charts-slider')
}

const elements = {...cardLiveElements, ...dashboard};

module.exports = elements