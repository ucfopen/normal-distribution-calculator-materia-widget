import {zScore, zTable, round, culmulativeProb, probDensity, calculateAnswer, createHiDPICanvas} from './utils'

describe('utils', () => {

	beforeEach(()=>{})

	test('zScore should return 0 when stdev is 0', () => {
		expect(zScore(1, 1, 0)).toBe(0);
	})

	test('zScore should return x - mean / stdev when stdev isnt 0', () => {
		expect(zScore(10, 2, 2)).toBe(4)
		expect(zScore(10, 11, 1)).toBe(-1)
		expect(zScore(2, 1, 1)).toBe(1)
		expect(zScore(100, 30, 4)).toBe(17.5)
	})

	test('calculateAnswer should return expected values', () => {
		expect(calculateAnswer(10,2,1)).toEqual({
			left: 1,
			right: 0,
			abs: 1
		})

		expect(calculateAnswer(2.3,1.1,2.1)).toEqual({
			left: 0.4286,
			right: 0.5714,
			abs: 1.5714
		})
	})

	test('culmulativeProb should return 0 for very large z scores and 1 for very small z scores', () =>{
		expect(culmulativeProb(4, 0, 1)).toBe(0)
		expect(culmulativeProb(100, 0, 1)).toBe(0)
		expect(culmulativeProb(-4, 0, 1)).toBe(1)
		expect(culmulativeProb(-100, 0, 1)).toBe(1)
	})

	test('culmulativeProb should not return NaN and be in the 0-1 range', () =>{
		for(let i = 0; i < 140; i++) {
			let prob = culmulativeProb(70 - i, 0, 20);
			expect(prob).not.toBeNaN();
			expect(prob).toBeGreaterThanOrEqual(0);
			expect(prob).toBeLessThanOrEqual(1);
		}
	})

	test('probDensity should not return NaN and be in the 0-1 range', () =>{
		for(let i = 0; i < 140; i++) {
			let prob = probDensity(70 - i, 0, 20);
			expect(prob).not.toBeNaN();
			expect(prob).toBeGreaterThanOrEqual(0);
			expect(prob).toBeLessThanOrEqual(1);
		}
	})

	test('createHiDPICanvas attempts to create a canvas element correctly with all values provided', () => {
		const mockSetTransform = jest.fn();
		const mockGetContext = jest.fn(arg => {
			return {
				setTransform: mockSetTransform
			};
		});
		const mockCreateElement = jest.fn(arg => {
			return {
				style: {},
				getContext: mockGetContext
			}
		});
		global.document.createElement = mockCreateElement;

		const canvas = createHiDPICanvas(500, 320, 1);

		expect(mockCreateElement).toHaveBeenCalledWith('canvas');
		expect(mockGetContext).toHaveBeenCalledWith('2d');
		expect(mockSetTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);

		expect(canvas.width).toBe(500);
		expect(canvas.height).toBe(320);
		expect(canvas.style).toEqual({width: '500px', height: '320px'});
	});

	test('createHiDPICanvas attempts to create a canvas element correctly with no ratio provided', () => {
		const mockSetTransform = jest.fn();
		const mockGetContext = jest.fn(arg => {
			return {
				setTransform: mockSetTransform
			};
		});
		const mockCreateElement = jest.fn(arg => {
			return {
				style: {},
				getContext: mockGetContext
			}
		});
		global.document.createElement = mockCreateElement;

		const canvas = createHiDPICanvas(500, 320);

		expect(mockCreateElement).toHaveBeenCalledWith('canvas');
		expect(mockGetContext).toHaveBeenCalledWith('2d');
		expect(mockSetTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);

		expect(canvas.width).toBe(500);
		expect(canvas.height).toBe(320);
		expect(canvas.style).toEqual({width: '500px', height: '320px'});
	});

});
