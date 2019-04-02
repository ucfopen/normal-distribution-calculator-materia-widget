import Graph from './graph'
import {zTable, round, culmulativeProb, probDensity, calculateAnswer, createHiDPICanvas} from './utils'

// gets all the values from the dom inputs
const getValuesFromInputs = () => ({
	mean: parseFloat(meanInputEl.value),
	stddev: parseFloat(stddevInputEl.value),
	x: parseFloat(xInputEl.value),
	probType: probTypeInputEl.value
})

// updates the probabilty equation in the probType select drop down
const updateProbTypeDisplay = (mean, stddev, x) => {
	const {left, right, abs} = calculateAnswer(mean, stddev, x)
	leftOptionEl.innerHTML = `P(X &lt; x) = ${left}`;
	rightOptionEl.innerHTML = `P(X &gt; x) = ${right}`;
	absOptionEl.innerHTML = `2P(X &gt; |x|) = ${abs}`;
}

// update output info panel
const updateEquationDisplay = (mean, stddev) => {
	meanOutputEl.innerHTML = mean;
	stddevOutputEL.innerHTML = stddev;
	varOutputEL.innerHTML = Math.pow(stddev, 2).toFixed(2);
}

// Draw the chart and update the display
const drawGraph = () => {
	const {mean, stddev, x, probType} = getValuesFromInputs()

	if (isNaN(mean) || isNaN(stddev) || stddev <= 0 || isNaN(x)) return

	updateProbTypeDisplay(mean, stddev, x)
	updateEquationDisplay(mean, stddev)

	const myGraph = new Graph({
		canvas: myCanvas,
		minX: mean - stddev * 3,
		maxX: mean + stddev * 3,
		tickX: stddev,
		color: 'black',
		equation: (x) => probDensity(x, mean, stddev),
	});

	myGraph.draw(x, stddev, probType)
}

// collect input element references
const meanInputEl = document.getElementById("mean");
const stddevInputEl = document.getElementById("stddev");
const xInputEl = document.getElementById("x");
const probTypeInputEl = document.getElementById("probType");
const leftOptionEl = document.getElementById("leftOption");
const rightOptionEl = document.getElementById("rightOption");
const absOptionEl = document.getElementById("absOption");

// collect output element references
const meanOutputEl = document.getElementById("meanOut");
const stddevOutputEL = document.getElementById("stddevOut");
const varOutputEL = document.getElementById("varOut");


// Create canvas with the device resolution (ratio of 1 instead of pixel ratio)
const myCanvas = createHiDPICanvas(500, 320, 1);

// append canvas
document.getElementById("canvasContainer").appendChild(myCanvas);

// add input listeners
meanInputEl.addEventListener("input", drawGraph);
stddevInputEl.addEventListener("input", drawGraph);
xInputEl.addEventListener("input", drawGraph);
probTypeInputEl.addEventListener("input", drawGraph);

// draw initial graph
drawGraph();

// tell Materia to start
Materia.Engine.start({start: () => {}})
