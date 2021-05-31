var today = new Date();
let yesterday = new Date();
let twoDaysAgo = new Date();
let threeDaysAgo = new Date();
let fourDaysAgo = new Date();
let fiveDaysAgo = new Date();
let sixDaysAgo = new Date();
let sevenDaysAgo = new Date();

yesterday.setDate(today.getDate() - 1);
twoDaysAgo.setDate(today.getDate() - 2);
threeDaysAgo.setDate(today.getDate() - 3);
fourDaysAgo.setDate(today.getDate() - 4);
fiveDaysAgo.setDate(today.getDate() - 5);
sixDaysAgo.setDate(today.getDate() - 6);
sevenDaysAgo.setDate(today.getDate() - 7);


let stepsYesterday
let stepsTwoDaysAgo
let stepsThreeDaysAgo
let stepsFourDaysAgo
let stepsFiveDaysAgo
let stepsSixDaysAgo
let stepsSevenDaysAgo


const setAllDiagramStats = () => {
    const userEmail = JSON.parse(sessionStorage.getItem("loggedIn")).email;

    axios
    .get(`${getStepsOfUser}${userEmail}`)
    .then((resp) => {
      sessionStorage.setItem("loggedIn", JSON.stringify(resp.data));
      stepsYesterday = findStepsOfDateToDiagram(resp.data, yesterday.toISOString().slice(0, 10));
      stepsTwoDaysAgo = findStepsOfDateToDiagram(resp.data, twoDaysAgo.toISOString().slice(0, 10));
      stepsThreeDaysAgo = findStepsOfDateToDiagram(resp.data, threeDaysAgo.toISOString().slice(0, 10));
      stepsFourDaysAgo = findStepsOfDateToDiagram(resp.data, fourDaysAgo.toISOString().slice(0, 10));
      stepsFiveDaysAgo = findStepsOfDateToDiagram(resp.data, fiveDaysAgo.toISOString().slice(0, 10));
      stepsSixDaysAgo = findStepsOfDateToDiagram(resp.data, sixDaysAgo.toISOString().slice(0, 10));
      stepsSevenDaysAgo = findStepsOfDateToDiagram(resp.data, sevenDaysAgo.toISOString().slice(0, 10));
    })
    .then(() => {
        renderDiagram()
        setAvrageAmount()
      });
}
//----------------------------------Render the diagram----------------------------------
function renderDiagram() {

    // chart colors
    var colors = [
      "#007bff",
      "#28a745",
      "#333333",
      "#c3e6cb",
      "#dc3545",
      "#6c757d",
    ];
  
    // set seven last days
    var chLine = document.getElementById("chLine");
  
    /* large line chart */
  
    var chartData = {
      labels: [
        sevenDaysAgo.toISOString().slice(5, 10),
        sixDaysAgo.toISOString().slice(5, 10),
        fiveDaysAgo.toISOString().slice(5, 10),
        fourDaysAgo.toISOString().slice(5, 10),
        threeDaysAgo.toISOString().slice(5, 10),
        twoDaysAgo.toISOString().slice(5, 10),
        yesterday.toISOString().slice(5, 10),
      ],
      datasets: [
        {
          data: [stepsSevenDaysAgo, stepsSixDaysAgo, stepsFiveDaysAgo, stepsFourDaysAgo, stepsThreeDaysAgo, stepsTwoDaysAgo, stepsYesterday],
          backgroundColor: "transparent",
          borderColor: colors[0],
          borderWidth: 4,
          pointBackgroundColor: colors[0],
        },
        {
          data: [10000, 10000, 10000, 10000, 10000, 10000, 10000],
          backgroundColor: colors[3],
          borderColor: colors[2],
          borderWidth: 2,
          pointBackgroundColor: colors[2],
        },
      ],
    };
  
    if (chLine) {
      new Chart(chLine, {
        type: "line",
        data: chartData,
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
          },
          legend: {
            display: false,
          },
        },
      });
    }
  }
  
// ----------------------------------Gets the steps for choosen date ----------------------------------
function getStepsToDiagram(date) {
  console.log("Date jag skickar in " + date);
  const userEmail = JSON.parse(sessionStorage.getItem("loggedIn")).email;
  console.log(userEmail);
  let stepsToDiagram;

  axios
    .get(`${getStepsOfUser}${userEmail}`)
    .then((resp) => {
      sessionStorage.setItem("loggedIn", JSON.stringify(resp.data));
      stepsToDiagram = findStepsOfDateToDiagram(resp.data, date);
      console.log("steps inne i axios .then functionen " + stepsToDiagram);
    })
    .then(() => {
      console.log("steps to diagram i functionen " + stepsToDiagram);
      return stepsToDiagram;
    });
}


// ----------------------------------Calls method to gets steps for each day ----------------------------------
function getSevenLastDaysSteps() {
    stepsYesterday = getStepsToDiagram(
        yesterday.toISOString().slice(0, 10));

    stepsTwoDaysAgo = getStepsToDiagram(
      twoDaysAgo.toISOString().slice(0, 10));

    stepsThreeDaysAgo = getStepsToDiagram(
      threeDaysAgo.toISOString().slice(0, 10));

    stepsFourDaysAgo = getStepsToDiagram(
      fourDaysAgo.toISOString().slice(0, 10));

    stepsFiveDaysAgo = getStepsToDiagram(
      fiveDaysAgo.toISOString().slice(0, 10));

    stepsSixDaysAgo = getStepsToDiagram(
      sixDaysAgo.toISOString().slice(0, 10));

    stepsSevenDaysAgo = getStepsToDiagram(
      sevenDaysAgo.toISOString().slice(0, 10));

  }

  // ----------------------------------Calculate Avrage amount of steps last week----------------------------------
  function setAvrageAmount(){
    let avrage = (stepsYesterday + stepsTwoDaysAgo + stepsThreeDaysAgo + stepsFourDaysAgo + stepsFiveDaysAgo + stepsSixDaysAgo + stepsSevenDaysAgo)/7

    $('#avrage-last-week').append(`${Math.round(avrage)}`)
  }

$(document).ready(function() {
    setAllDiagramStats()
  });




