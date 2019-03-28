
export default class Graph {
	constructor(config) {
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
	}

	// Figure out ticks on Y axis
	calcY() {
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
	}

	// Draw axes and labels for them
	drawAxes(){
		let context = this.context;
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
	}

	//  X-axis
	drawXAxis() {
		let context = this.context;
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
	}

	// Y-axis
	drawYAxis() {
		let context = this.context;
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
	}

	// We have to flip our Y again when drawing text
	// If this ever gets so slow we should batch these to reduce context changes
	drawText(text, x, y) {
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
	}

	// Translate a real X value from a formula into the pixel X value we draw onto the graph
	getPixelX(x) {
		return this.marginX + (x - this.minX)  * this.scaleX;
	}

	// Same for Y
	getPixelY(y) {
		return this.marginY + (y - this.minY) * this.scaleY;
	}

	// Draw the graph
	draw(x, stddev, probType) {
		const context = this.context;
		const equation = this.equation

		context.save();
		context.beginPath();
		context.moveTo(this.getPixelX(this.minX), this.getPixelY(equation(this.minX)));
		for(let x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
			const y = equation(x);
			context.lineTo(this.getPixelX(x), this.getPixelY(y));
		}
		context.lineJoin = 'round';
		context.lineWidth = 3;
		context.strokeStyle = this.color;
		context.stroke();
		context.restore();

		// Don't highlight anything is X isn't selected and in the bounds of the graph
		if(isNaN(x) || x < this.minX || x > this.maxX) return;
		// Highlight selected area
		if(probType == "left") {
			this.highlightArea(this.minX, x, '#f1cdccb8');
			// Highlight X
			this.highlightArea(x - (stddev * 0.05), x + (stddev * 0.05), 'blue');
		}
		else if(probType == "right") {
			this.highlightArea(x, this.maxX, '#f1cdccb8');
			// Highlight X
			this.highlightArea(x - (stddev * 0.05), x + (stddev * 0.05), 'blue');
		}
		else if(probType == "abs") {
			const left = -Math.abs(x);
			const right = Math.abs(x);
			this.highlightArea(this.minX, left, '#f1cdccb8');
			this.highlightArea(right, this.maxX, '#f1cdccb8');
			// Highlight X
			this.highlightArea(left - (stddev * 0.05), left + (stddev * 0.05), 'blue');
			this.highlightArea(right - (stddev * 0.05), right + (stddev * 0.05), 'blue');
		}
	}

	// Draw part of a graph to highlight under it
	highlightArea(startX, endX, color) {
		let context = this.context;
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
	}

	// Flip y-axis so 0 is on the bottom
	transformContext() {
		let context = this.context;
		context.transform(1, 0, 0, -1, 0, this.canvas.height);
	}

}
