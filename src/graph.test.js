import {createHiDPICanvas} from './utils'

import Graph from './graph';

describe('graph', () => {
	//mock out all of the needed HTML canvas element functionality
	const mockBeginPath = jest.fn();
	const mockMoveTo = jest.fn();
	const mockLineTo = jest.fn();
	const mockStroke = jest.fn();
	const mockSave = jest.fn();
	const mockFill = jest.fn();
	const mockFillText = jest.fn();
	const mockRestore = jest.fn();
	const mockTranslate = jest.fn();
	const mockTransform = jest.fn();
	const mockRotate = jest.fn();
	const mockSetTransform = jest.fn();
	const mockClearRect = jest.fn();
	const mockGetContext = jest.fn(arg => {
		return {
			beginPath: mockBeginPath,
			moveTo: mockMoveTo,
			lineTo: mockLineTo,
			stroke: mockStroke,
			save: mockSave,
			fill: mockFill,
			fillText: mockFillText,
			restore: mockRestore,
			translate: mockTranslate,
			transform: mockTransform,
			rotate: mockRotate,
			setTransform: mockSetTransform,
			clearRect: mockClearRect
		};
	});
	const mockCreateElement = jest.fn(arg => {
		return {
			style: {},
			getContext: mockGetContext
		}
	});

	beforeEach(()=>{
		global.document.createElement = mockCreateElement;
	})

	test('it creates a Graph object when expected config properties are provided', () => {
		const canvas = createHiDPICanvas(500, 320);

		const graph = new Graph({
			canvas: canvas,
			equation: (x) => jest.fn()
		});

		expect(mockClearRect).toHaveBeenCalledWith(0, 0, 500, 320);

		expect(graph.minX).toBe(0);
		expect(graph.maxX).toBe(10);
		expect(graph.color).toBe('green');
		expect(graph.resolution).toBe(100);
	});

	test('it creates a Graph object when expected config properties are provided', () => {
		const canvas = createHiDPICanvas(500, 320);

		const graph = new Graph({
			canvas: canvas,
			minX: 1,
			maxX: 500,
			tickX: 1,
			color: 'black',
			equation: (x) => jest.fn()
		});

		expect(mockClearRect).toHaveBeenCalledWith(0, 0, 500, 320);

		expect(graph.minX).toBe(1);
		expect(graph.maxX).toBe(500);
		expect(graph.color).toBe('black');
		expect(graph.resolution).toBe(100);
	});

});
