console.log('ChartJS Loaded');

const Chart = require('chart.js');
const elements = require('../views/elements');
const axios = require('axios');
const HOST = 'http://localhost:3000';
const topbarSearch = require('../all-scripts/topbarSearch');

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
            hoverBackgroundColor: "#2e59d9",
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

  canvasCreate(data, element = this.element) {
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


    // The ID for each (canvas) will start on the index 1:-
    var id = 0;
    let canvas = faculties3in1Array.map((faculty) => {

      // faculty is again an array:- This means, the first return will get a new array with possible 3 elements:-
      return faculty.map((name) => {
        id++;
        return `<div class="col-4 text-center">
                  <div style="width: 300px; height: 300px; background: #eee"></div>
                  <span>${name}</span>
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
}

const initCharts = async (year) => {
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
  const search = topbarSearch('afterend', 'sidebarToggleTop', `YEAR - ${year}`);


  console.log(data);

  // Faculties Chart Init:-
  const facultiesChart = new FacultiesChart(data, elements.facultiesChart);
  facultiesChart.chart();

  const deptsChart = new DepartmentsChart(data, elements.deptsSlider);
  deptsChart.canvasCreate(data);

};

initCharts(1401);