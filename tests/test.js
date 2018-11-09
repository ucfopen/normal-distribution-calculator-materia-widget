// fake dom
document.body.innerHTML = 
'<input id="mean">' +
'<input id="stddev">' +
'<input id="x">' +
'<input id="probType">' +
'<input id="meanOut">' +
'<input id="stddevOut">' +
'<input id="varOut">';

const player = require('../src/controllers/player');

const probDensity = player.probDensity;

test('adds 1+2 to equal 3', () => {
	expect((1+2)).toBe(3);
});