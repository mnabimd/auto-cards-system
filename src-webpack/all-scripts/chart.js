console.log('ChartJS Loaded');

const Chart = require('chart.js');
const elements = require('../views/elements');
const axios = require('axios');
const HOST = 'http://localhost:3000';
const topbarSearch = require('../all-scripts/topbarSearch');
const currentYear = require('../../src-server/settings/appSettings.json').currentEducationalYear;



// Chart.js gLobal settings:-
Chart.defaults.global.defaultFontFamily = 'Bahij Nazanin', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontSize = 13;

class FacultiesChart {

  constructor(data, element) {
    this.data = data;
    this.element = element;
  };

  stateGenerate(data) {

    const facultiesNames = data.facultiesWithDepts.map(faculty => faculty.name);
    const facultiesTotal = data.facultiesWithDepts.map(faculty => faculty.total);
    const facultyWithHighCards = Math.max(...facultiesTotal);


    const male = data.facultiesWithDepts.map(faculty => faculty.genderObj.male);
    const female = data.facultiesWithDepts.map(faculty => faculty.genderObj.female);

    return {
      facultiesNames,
      facultiesTotal,
      male,
      female,
      facultyWithHighCards
    }
  };

  chart(ctx = this.element, options = this.stateGenerate(this.data)) {


    let bars = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: options.facultiesNames,
        datasets: [{
            label: "Male",
            backgroundColor: "#4e73df",
            hoverBackgroundColor: "#2e59d9",
            borderColor: "#4e73df",
            data: options.male,
          },
          {
            label: "Female",
            backgroundColor: 'skyblue',
            borderColor: "#4e73df",
            data: options.female,
          }
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            time: {
              unit: 'card'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 20
            },
            maxBarThickness: 35,
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              min: 0,
              max: options.facultyWithHighCards,
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: true
        },
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data['labels'][tooltipItem[0]['index']];
            },
            afterLabel: function (tooltipItem, data) {
              return `Total: ${options.facultiesTotal[tooltipItem.index]}`;
            }
          },
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false
        }
      }

    });
  }

}

class DepartmentsChart {
  constructor(data, element) {
    this.data = data;
    this.element = element;
  }

  canvasCreate(data = this.data, element = this.element) {

    // Empty element (.carousel-inner), if it's children were already there:-
    if (element.children.length != 0) {
      element.innerHTML = '';
    }

    const faculties = data.facultiesWithDepts.map(faculty => faculty.name);

    // Divs are the (number) of .carousel-items which will be generated to .carousel-inner:-
    let possibleDivs = Math.ceil(faculties.length / 3);

    // By the help of loop, the below array will include the names of 3 faculties in a new array:-
    let faculties3in1Array = [];
    for (let i = 0; i < possibleDivs; i++) {

      // Insert 3 faculties as a new array to the faculties3in1Array:- 
      faculties3in1Array[i] = faculties.filter((faculty, index, array) => {
        let j = i * 3;
        return index === j || index === (j + 1) || index === (j + 2)
      });
    };


    // The ID for each (canvas) will start on the index 0:-
    var id = -1;
    let canvas = faculties3in1Array.map((faculty) => {

      // faculty is again an array:- This means, the first return will get a new array with possible 3 elements:-
      return faculty.map((name) => {
        id++;
        return `<div class="col-4 text-center">
                  <canvas id="depChart-${id}" class="chartjs-render-monitor" style="width: 300px; height: 300px; "></canvas>
                  <hr/>
                  <span class="pashtoFont">${name}</span>
                </div>`
      });
    });


    // Template is the function for returning the .carousel-item and appending canvas in it:-
    const template = (chart, active) => {
      // canvas will be used to join the elements in (chart) array:-
      const canvas = (theChart) => {
        let string = ``;

        for (let i = 0; i < theChart.length; i++) {
          string += theChart[i]
        };

        return string;
      }

      if (active) {
        return `<div class="carousel-item active">
                  <div class="row">${canvas(chart)}</div>
                </div>`;
      }

      return `<div class="carousel-item">
                  <div class="row">${canvas(chart)}</div>
               </div>`;

    }

    // This loop will be used to fetch or insert the canvases to (element or .carousel-inner):-
    for (let i = 0; i < canvas.length; i++) {

      // First SLIDE/Active:-
      if (i === 0) {
        // afterbegin will insert the canvases after the children of (element) and make it active
        element.insertAdjacentHTML('afterbegin', template(canvas[i], true))
      } else {
        // beforeend will insert the canvases after the children of (element) 
        element.insertAdjacentHTML('beforeend', template(canvas[i]))
      }

    }
  }

  faculties(data = this.data) {
    return data.facultiesWithDepts.map(faculty => faculty.name);
  }

  stateGenerate(index, data = this.data) {

    const state = data.facultiesWithDepts.map(faculty => faculty.branches);

    const singleDep = state[index];

    const names = singleDep.map(dep => dep.branch);
    const total = singleDep.map(dep => dep.total);
    const male = singleDep.map(dep => dep.gender.male);
    const female = singleDep.map(dep => dep.gender.female);

    const obj = {
      names,
      total,
      male,
      female
    }

    return obj;
  }

  chart(ctx) {
    // Pie Chart Example
    // the element's ID:-
    const index = ctx.id.split('-')[1];

    const state = this.stateGenerate(index);

    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: state.names,
        datasets: [{
          label: 'Card',
          data: state.total,
          backgroundColor: ['#4e73df', '#36b9cc', '#1cc88a', '#777', '#9fb8ad', '#003f5c', '#282846', '#03506f', '#903749', '#ffcb91', '#7868e6', '#ccffbd'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: true,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return `${data.labels[tooltipItem.index]} څانګه`;
            },
            afterLabel: function (tooltipItem, data) {
              return `Male: ${state.male[tooltipItem.index]} | Female: ${state.female[tooltipItem.index]} | Total: ${state.total[tooltipItem.index]}`;
            }
          },
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 25,
          yPadding: 25,
          displayColors: true,
          caretPadding: 10,
        },
        legend: {
          display: true
        },
        cutoutPercentage: 0,
      },
    });

  }
}

class Statistics {
  constructor(data) {
    this.data = data;
  };

  state(data = this.data) {
    return {
      year: data.year,
      generalMale: data.generalAllYears.gender.male,
      generalFemale: data.generalAllYears.gender.female,
      generalBoth: data.generalAllYears.cardsTaken,
      generalAll: data.generalAllYears.totalCards,
      yearlyMale: data.generalYearly.gender.male,
      yearlyFemale: data.generalYearly.gender.female,
      yearlyBoth: data.generalYearly.cardsTaken,
      yearlyAll: data.generalYearly.totalCards
    };
  }

  updateElements(data = this.state(this.data)) {
    const elements = ['general-male', 'general-female', 'general-both', 'general-all', 'yearly-male', 'yearly-female', 'yearly-both', 'yearly-all'];

    elements.forEach(element => {
      const returnJSName = (word) => {

        let nameJS = word.split('-');
        let cap2Word = nameJS[1].split('');
        cap2Word[0] = cap2Word[0].toUpperCase();
        cap2Word = cap2Word.join('');

        nameJS[1] = cap2Word;

        nameJS = nameJS.join('');
        return nameJS
      }

      const dataValue = returnJSName(element);

      document.getElementById(element).innerText = data[dataValue];
    });

    // Year
    document.getElementById('ihsayaYear').innerText = data.year;
  }
}

const initCharts = async (year = currentYear) => {
  const data = await (async () => {
    const response = await axios.post(`${HOST}/dashboard`, {
      year
    });

    if (response.data.code == 500) {
      return 'No data from DB';
    }

    return response.data.data;
  })();

  // Append Search Bar with the current Year:-
  const search = topbarSearch('afterend', 'sidebarToggleTop', `YEAR - ${year}`, year);

  // Faculties Chart Init:-
  const facultiesChart = new FacultiesChart(data, elements.facultiesChart);
  facultiesChart.chart();

  // Departments Pie Init:-
  const deptsChart = new DepartmentsChart(data, elements.deptsSlider);
  deptsChart.canvasCreate();
  const faculties = deptsChart.faculties();

  // Let's create a loop for drawing the pie/chart for all faculties:-
  for (let i = 0; i < faculties.length; i++) {
    deptsChart.chart(document.getElementById(`depChart-${i}`));
  };


  // Update Statistics Values:-
  const statistics = new Statistics(data);
  statistics.updateElements();

  // Add the event handler for year search in topbarSearch:-
  const searchElements = {input: document.getElementById('searched-year'), button: document.getElementById('search-button')};

  const searchingYears = (el1 = searchElements.input, el2 = searchElements.button) => {
      el2.addEventListener('click', (e) => {
        initCharts(el1.value);
      });
  }; searchingYears();

};



initCharts();
