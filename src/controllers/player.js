var mean_input = document.getElementById("mean");
var stddev_input = document.getElementById("stddev");
var x_input = document.getElementById("x");
var probType_input = document.getElementById("probType");

var mean_output = document.getElementById("meanOut");
var stddev_output = document.getElementById("stddevOut");
var var_output = document.getElementById("varOut");

var leftOption = document.getElementById("leftOption");
var rightOption = document.getElementById("rightOption");
var absOption = document.getElementById("absOption");

mean_input.addEventListener("input", updateChart);
stddev_input.addEventListener("input", updateChart);
x_input.addEventListener("input", updateX);
probType_input.addEventListener("input", updateX);
var myGraph; // will hold graph object

// Z table for lookups
var zTable = {
      "z"  :  [0     , 0.01  , 0.02  , 0.03  , 0.04,   0.05  , 0.06  , 0.07  , 0.08  , 0.09  ],
      "0"  :  [0.5000, 0.5040, 0.5080, 0.5120, 0.5160, 0.5199, 0.5239, 0.5279, 0.5319, 0.5359],
      "0.1":  [0.5398, 0.5438, 0.5478, 0.5517, 0.5557, 0.5596, 0.5636, 0.5675, 0.5714, 0.5753],
      "0.2":  [0.5793, 0.5832, 0.5871, 0.5910, 0.5948, 0.5987, 0.6026, 0.6064, 0.6103, 0.6141],
      "0.3":  [0.6179, 0.6217, 0.6255, 0.6293, 0.6331, 0.6368, 0.6406, 0.6443, 0.6480, 0.6517],
      "0.4":  [0.6554, 0.6591, 0.6628, 0.6664, 0.6700, 0.6736, 0.6772, 0.6808, 0.6844, 0.6879],
      "0.5":  [0.6915, 0.6950, 0.6985, 0.7019, 0.7054, 0.7088, 0.7123, 0.7157, 0.7190, 0.7224],
      "0.6":  [0.7257, 0.7291, 0.7324, 0.7357, 0.7389, 0.7422, 0.7454, 0.7486, 0.7517, 0.7549],
      "0.7":  [0.7580, 0.7611, 0.7642, 0.7673, 0.7704, 0.7734, 0.7764, 0.7794, 0.7823, 0.7852],
      "0.8":  [0.7881, 0.7910, 0.7939, 0.7967, 0.7995, 0.8023, 0.8051, 0.8078, 0.8106, 0.8133],
      "0.9":  [0.8159, 0.8186, 0.8212, 0.8238, 0.8264, 0.8289, 0.8315, 0.8340, 0.8365, 0.8389],
      "1"  :  [0.8413, 0.8438, 0.8461, 0.8485, 0.8508, 0.8531, 0.8554, 0.8577, 0.8599, 0.8621],
      "1.1":  [0.8643, 0.8665, 0.8686, 0.8708, 0.8729, 0.8749, 0.8770, 0.8790, 0.8810, 0.8830],
      "1.2":  [0.8849, 0.8869, 0.8888, 0.8907, 0.8925, 0.8944, 0.8962, 0.8980, 0.8997, 0.9015],
      "1.3":  [0.9032, 0.9049, 0.9066, 0.9082, 0.9099, 0.9115, 0.9131, 0.9147, 0.9162, 0.9177],
      "1.4":  [0.9192, 0.9207, 0.9222, 0.9236, 0.9251, 0.9265, 0.9279, 0.9292, 0.9306, 0.9319],
      "1.5":  [0.9332, 0.9345, 0.9357, 0.9370, 0.9382, 0.9394, 0.9406, 0.9418, 0.9429, 0.9441],
      "1.6":  [0.9452, 0.9463, 0.9474, 0.9484, 0.9495, 0.9505, 0.9515, 0.9525, 0.9535, 0.9545],
      "1.7":  [0.9554, 0.9564, 0.9573, 0.9582, 0.9591, 0.9599, 0.9608, 0.9616, 0.9625, 0.9633],
      "1.8":  [0.9641, 0.9649, 0.9656, 0.9664, 0.9671, 0.9678, 0.9686, 0.9693, 0.9699, 0.9706],
      "1.9":  [0.9713, 0.9719, 0.9726, 0.9732, 0.9738, 0.9744, 0.9750, 0.9756, 0.9761, 0.9767],
      "2"  :  [0.9772, 0.9778, 0.9783, 0.9788, 0.9793, 0.9798, 0.9803, 0.9808, 0.9812, 0.9817],
      "2.1":  [0.9821, 0.9826, 0.9830, 0.9834, 0.9838, 0.9842, 0.9846, 0.9850, 0.9854, 0.9857],
      "2.2":  [0.9861, 0.9864, 0.9868, 0.9871, 0.9875, 0.9878, 0.9881, 0.9884, 0.9887, 0.9890],
      "2.3":  [0.9893, 0.9896, 0.9898, 0.9901, 0.9904, 0.9906, 0.9909, 0.9911, 0.9913, 0.9916],
      "2.4":  [0.9918, 0.9920, 0.9922, 0.9925, 0.9927, 0.9929, 0.9931, 0.9932, 0.9934, 0.9936],
      "2.5":  [0.9938, 0.9940, 0.9941, 0.9943, 0.9945, 0.9946, 0.9948, 0.9949, 0.9951, 0.9952],
      "2.6":  [0.9953, 0.9955, 0.9956, 0.9957, 0.9959, 0.9960, 0.9961, 0.9962, 0.9963, 0.9964],
      "2.7":  [0.9965, 0.9966, 0.9967, 0.9968, 0.9969, 0.9970, 0.9971, 0.9972, 0.9973, 0.9974],
      "2.8":  [0.9974, 0.9975, 0.9976, 0.9977, 0.9977, 0.9978, 0.9979, 0.9979, 0.9980, 0.9981],
      "2.9":  [0.9981, 0.9982, 0.9982, 0.9983, 0.9984, 0.9984, 0.9985, 0.9985, 0.9986, 0.9986],
      "3"  :  [0.9987, 0.9987, 0.9987, 0.9988, 0.9988, 0.9989, 0.9989, 0.9989, 0.9990, 0.9990],
      "3.1":  [0.9990, 0.9991, 0.9991, 0.9991, 0.9992, 0.9992, 0.9992, 0.9992, 0.9993, 0.9993],
      "3.2":  [0.9993, 0.9993, 0.9994, 0.9994, 0.9994, 0.9994, 0.9994, 0.9995, 0.9995, 0.9995],
      "3.3":  [0.9995, 0.9995, 0.9995, 0.9996, 0.9996, 0.9996, 0.9996, 0.9996, 0.9996, 0.9997],
      "3.4":  [0.9997, 0.9997, 0.9997, 0.9997, 0.9997, 0.9997, 0.9997, 0.9997, 0.9997, 0.9998]
    };

// Probabilty of finding X in distribution
function probDensity(x, mean, stddev) {
  return (1.0 / Math.sqrt(2.0 * Math.PI * stddev * stddev)) * Math.exp((- 1.0 / (2.0 * stddev * stddev)) * Math.pow(x - mean, 2.0));
}

// Calc the z score
function zScore(x, mean, stddev) {
  return (x - mean) / stddev;
}
// Round value to decimal places
function _round(value, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
}

// Probability of finding everything left of X
function culmulativeProb(x, mean, stddev) {
  var z = zScore(x, mean, stddev);
  z = _round(z, 2);
  // check for outlier values
  if(z >= 4) return 0;
  if(z <= -4) return 1;
  const absZScore = Math.abs(z);
  const zRow = Math.floor(absZScore * 10) / 10;
  const zCol = _round((Math.round(absZScore * 100) % 10) / 100, 2);
  const zColIndex = zTable.z.indexOf(zCol);
  const absPercentile = zTable[zRow.toString()][zColIndex];

  return z < 0 ? 1 - absPercentile : absPercentile;
}

// Something has changed, try to update chart
function updateChart() {
  const mean = parseFloat(mean_input.value);
  const stddev = parseFloat(stddev_input.value);
  const x = parseFloat(x_input.value);
  const probType = probType_input.value;

  let minX = mean - stddev * 3;
  let maxX = mean + stddev * 3;
  myGraph = new Graph({
          canvas: myCanvas,
          minX: minX,
          maxX: maxX,
          tickX: stddev,
          color: 'black',
          equation: function(x) { return probDensity(x, mean, stddev); },
  });

  myGraph.draw();
  // update info panel on bottom
  mean_output.innerHTML = mean;
  stddev_output.innerHTML = stddev;
  var_output.innerHTML = Math.pow(stddev, 2).toFixed(2);
  
  // Don't highlight anything is X isn't selected and in the bounds of the graph
  if(isNaN(x) || x < minX || x > maxX) return;
  // Highlight selected area
  if(probType == "left") {
    myGraph.highlightArea(minX, x, '#f1cdccb8');
  }
  else if(probType == "right") {
    myGraph.highlightArea(x, maxX, '#f1cdccb8');
  }
  else if(probType == "abs") {
    let left = -Math.abs(x);
    let right = Math.abs(x);
    myGraph.highlightArea(minX, left, '#f1cdccb8');
    myGraph.highlightArea(right, maxX, '#f1cdccb8');

  }
  
  // Highlight X
  myGraph.highlightArea(x - (stddev*0.05), x + (stddev*0.05), 'blue');
}

// X input has changed, try to give answer and then update chart
function updateX(e) {
    const mean = parseFloat(mean_input.value);
    const stddev = parseFloat(stddev_input.value);
    const x = parseFloat(x_input.value);
    const probType = probType_input.value;
    if(isNaN(mean)|| isNaN(stddev) || isNaN(x))
      return;
    const left =   _round(culmulativeProb(x, mean, stddev), 5);
    const right = _round(1 - culmulativeProb(x, mean, stddev), 5);
    const abs = _round((1 - culmulativeProb(Math.abs(x), mean, stddev)) + culmulativeProb(-Math.abs(x), mean, stddev), 5);
    leftOption.innerHTML = `P(X &lt; x) = ${left}`;
    rightOption.innerHTML = `P(X &gt; x) = ${right}`;
    absOption.innerHTML = `2P(X &gt; |x|) = ${abs}`;

    updateChart();
}

function Graph(config) {
  this.init(config);
}

Graph.prototype.init = function(config) {
  // user defined properties
  this.canvas = config.canvas;
  
  this.minX = config.minX || 0;
  this.minY = config.minY || 0; // for use if tickY isn't set
  
  this.maxX = config.maxX || 10;
  this.maxY = config.maxY || 10; // for use if tickY isn't set
  
  // Space on left until X's 0 starts (axis and label are drawn in this space)
  this.marginX = config.maginX || 60;
  // Space on bottom until Y's 0 starts (axis and label are drawn in this space)
  this.marginY = config.marginY || 45;
  // Space on top of graph, usually just makes sure things don't get cut off
  this.marginTop = config.marginTop || 20;
  // Space to the right of the graph, just prevents tings from cutting off
  this.marginRight = config.marginRight || 15;

  this.labelX = config.labelX || "x";
  this.labelY = config.labelY || "f(x)";
  
  this.color = config.color || "green";

  this.equation = config.equation;
  // How many samples to take inbetween each point
  this.resolution = config.resolution || 100;
  
  this.tickX = config.tickX || 1;
  this.iteration = (this.maxX - this.minX) / this.resolution;
  // If tickY is set use that, otherwise we recalculate tickY, minY, and maxY based on equation and min/max X
  if(config.tickY)
  {
    this.tickY = config.tickY;
  }
  else {
    this.calcY();
  }

  // constants
  this.axisColor = '#aaa';
  this.font = '12pt Calibri';
  this.tickSize = 5;

  // relationships
  this.context = this.canvas.getContext('2d');

  this.rangeX = this.maxX - this.minX;
  this.rangeY = this.maxY - this.minY;

  // Scale used to map calcuated X,Y -> Canvas X,Y for graphing
  this.scaleX = (this.canvas.width - this.marginX - this.marginRight) / this.rangeX;
  this.scaleY = (this.canvas.height - this.marginY - this.marginTop) / this.rangeY;

  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // draw x and y axis
  this.drawAxes();
};

// Figure out ticks on Y axis
Graph.prototype.calcY = function() {

  let max = Number.NEGATIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;
  for(let x = this.minX; x < this.maxX; x += this.tickX) {
    let y = this.equation(x);
    if(y < min) min = y;
    if(y > max) max = y;
  }
  let range = max - min;
  let tickRange = range / 5.0;
  let pow10x = Math.pow(10, Math.ceil(Math.log(tickRange) - 1));
  let roundedTickRange = Math.ceil(tickRange / pow10x) * pow10x;

  this.minY = Math.floor(min * Math.pow(10, 2)) / Math.pow(10, 2);
  this.maxY = Math.ceil(max * Math.pow(10, 2)) / Math.pow(10, 2);
  this.tickY = Number(roundedTickRange.toFixed(2));
};

// Draw axes and labels for them
Graph.prototype.drawAxes = function(){
  var context = this.context;
  context.resetTransform();
  this.transformContext();
  this.drawXAxis();
  this.drawYAxis();
  this.drawText(this.labelX, this.getPixelX((this.maxX + this.minX)/2), this.marginY / 3);
  // draw this one rotated
  context.save();
  context.resetTransform();
  context.translate(5, this.canvas.height - this.getPixelY((this.maxY + this.minY) / 2));
  context.rotate(-90 * Math.PI / 180);
  context.fillText(this.labelY, 0, 0);
  context.restore();
};

//  X-axis
Graph.prototype.drawXAxis = function() {
  var context = this.context;        
  // Draw x axis
  context.beginPath();
  context.moveTo(this.marginX, this.marginY);
  context.lineTo(this.canvas.width - this.marginRight, this.marginY);
  context.strokeStyle = this.axisColor;
  context.lineWidth = 2;
  context.stroke();

  // draw tick marks
  context.font = this.font;
  context.textAlign = 'center';
  context.textBaseline = 'top';

  let xPos = this.marginX;
  let yPos = Math.floor(this.marginY / 2);
  for(let x = this.minX; x <= this.maxX; x+= this.tickX) {
    xPos = this.getPixelX(x);
    context.moveTo(xPos, this.marginY - this.tickSize / 2);
    context.lineTo(xPos, this.marginY + this.tickSize / 2);
    context.stroke();
    this.drawText(x, xPos, this.marginY - 5);
  }
};

// Y-axis
Graph.prototype.drawYAxis = function() {
  var context = this.context;
  context.beginPath();
  context.moveTo(this.marginX, this.marginY);
  context.lineTo(this.marginX, this.canvas.height - this.marginTop);
  context.strokeStyle = this.axisColor;
  context.lineWidth = 2;
  context.stroke();

  // draw tick marks
  context.font = this.font;
  context.textAlign = 'right';
  context.textBaseline = 'middle';

  let xPos = Math.floor(this.marginX / 2);
  let yPos = this.marginY;
  for(let y = this.minY; y <= this.maxY; y+= this.tickY) {
    yPos = this.getPixelY(y);
    context.moveTo(this.marginX - this.tickSize / 2, yPos);
    context.lineTo(this.marginX + this.tickSize / 2, yPos);
    context.stroke();
    this.drawText(y, this.marginX - 5, yPos);
  }
};

// We have to flip our Y again when drawing text
// If this ever gets so slow we should batch these to reduce context changes
Graph.prototype.drawText = function(text, x, y) {
  let context = this.context;
  context.save();
  y = this.canvas.height - y;
  context.resetTransform();
  // is text a number
  if(!isNaN(text)) {
    text = text == Math.floor(text) ? text : text.toFixed(2); // Convert to at most 2 digits decimal 
  }
  context.fillText(text, x, y);
  context.restore();
};

// Translate a real X value from a formula into the pixel X value we draw onto the graph
Graph.prototype.getPixelX = function(x) {
  return this.marginX + (x - this.minX)  * this.scaleX;
};

// Same for Y
Graph.prototype.getPixelY = function(y) {
  return this.marginY + (y - this.minY) * this.scaleY;
};

// Draw the graph
Graph.prototype.draw = function() {
  var context = this.context;
  let equation = this.equation

  context.save();
  context.beginPath();
  context.moveTo(this.getPixelX(this.minX), this.getPixelY(equation(this.minX)));
  for(var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
    let y = equation(x);
    context.lineTo(this.getPixelX(x), this.getPixelY(y));
  }
  context.lineJoin = 'round';
  context.lineWidth = 3;
  context.strokeStyle = this.color;
  context.stroke();
  context.restore();
};

// Draw part of a graph to highlight under it
Graph.prototype.highlightArea = function(startX, endX, color) {
  var context = this.context;
  let equation = this.equation;
  context.save();
  context.beginPath();
  
  let startY = equation(startX);
  context.moveTo(this.getPixelX(startX), this.getPixelY(this.minY));
  startY = Math.max(startY, this.minY);
  context.lineTo(this.getPixelX(startX), this.getPixelY(startY));
  for(var x = startX + this.iteration; x < endX; x += this.iteration) {
    let y = equation(x);
    context.lineTo(this.getPixelX(x), this.getPixelY(y));
  }
  context.lineTo(this.getPixelX(x), this.getPixelY(this.minY));
  context.lineJoin = 'round';
  context.lineWidth = 3;
  context.fillStyle = color;
  context.fill();
  context.restore();
};

// Flip y-axis so 0 is on the bottom
Graph.prototype.transformContext = function() {
  var context = this.context;
  context.transform(1, 0, 0, -1, 0, this.canvas.height);
};

// Set of functions to make canvas compatible with device resolution
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

// Create canvas with ratio
var createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

// Create canvas with the device resolution (ratio of 1 instead of pixel ratio)
var myCanvas = createHiDPICanvas(500, 320, 1);
// Add canvas
document.getElementById("canvasContainer").appendChild(myCanvas);
var ctx = myCanvas.getContext('2d');
