import { Sphere, Quad, Box, Mesh } from './objects.js';
import { loadMesh, getObjBoundingBox, getSpheresRandom } from './util.js';

const groundDefault = new Sphere([0, -1001, 0], [0.5, 0.5, 0.5], 1000, [0.9, 0.0, 0.6, 0.0]);

async function getAvailableScene(index, scenesList)
{
    let sceneName = Object.keys(scenesList)[index];
    let sceneFunction = eval(sceneName);
    return await sceneFunction();
}

async function Spheres(numSpheres = 4)
{
    let offset = [0, -1, -5];
    let spheres = [groundDefault];
    spheres = spheres.concat(getSpheresRandom(numSpheres, offset));

    spheres.push(new Sphere([offset[0], 1.3 + offset[1], offset[2]], [1.0, 1.0, 1.0], 1.3, [-1.0, 0.001, 0.9, 0.0]));
    spheres.push(new Sphere([-3.3 + offset[0], 1.3 + offset[1], offset[2]], [1.0, 0.1, 0.1], 1.3, [0.0, 0.0, 0.0, 0.0]));
    spheres.push(new Sphere([3.3 + offset[0], 1.3 + offset[1], offset[2]], [0.7, 0.6, 0.5], 1.3, [1.0, 0.0, 1.0, 0.0]));

    return {
        spheres, 
        quads: [], 
        boxes: [], 
        triangles: [], 
        meshes: [], 
        backgroundColor1: [0.0, 0.5, 1.0], 
        backgroundColor2: [1.0, 1.0, 1.0], 
        focusDistance: 5.0, 
        focusAngle: 0.2,
        sunIntensity: 1.0,
        samplesPerPixel: 1.0,
        maxBounces: 10.0
    };
}

async function Night()
{
    let { spheres, quads, boxes, triangles, meshes, backgroundColor1, backgroundColor2 } = await Spheres();

    return {
        spheres,
        quads,
        boxes,
        triangles,
        meshes,
        backgroundColor1: [0.0, 0.0, 0.0],
        backgroundColor2: [0.0, 0.0, 0.0],
        focusDistance: 5.0,
        focusAngle: 0.2,
        sunIntensity: 0.1,
        samplesPerPixel: 1.0,
        maxBounces: 10.0
    }
}

async function Basic()
{
    let spheres = [
        new Sphere([0, -1001, 0], [0.5, 0.5, 0.5], 1000, [0.0, 0.0, 0.0, 0.0]),
        new Sphere([-0.0, -0.5, -2.0], [1.0, 0.0, 0.0], 0.5, [0.0, 0.0, 0.0, 0.0]),
    ];

    return {
        spheres, 
        quads: [], 
        boxes: [], 
        triangles: [], 
        meshes: [], 
        backgroundColor1: [0.0, 0.5, 1.0], 
        backgroundColor2: [1.0, 1.0, 1.0],
        focusDistance: 5.0, 
        focusAngle: 0.0,
        sunIntensity: 1.0,
        samplesPerPixel: 1.0,
        maxBounces: 10.0
    };
}

async function Metal() 
{
	let spheres = [
		new Sphere([0, -1001, 0], [0.10980392156862745, 0.12156862745098039, 0.2901960784313726], 1000, [1, 0, 0.01, 0]), 
		new Sphere([0, -0.26, -2], [1, 0, 0], 0.5, [1, 0, 1, 0]), 
		new Sphere([-1, -0.5, -2], [1, 0, 0], 0.5, [1, 0, 1, 0]), 
		new Sphere([1, -0.5, -2], [1, 0, 0], 0.5, [1, 0, 1, 0]), 
		new Sphere([0.01, 0.51, -1.9], [0.4, 0.9, 0.8], 0.23, [1, 0, 1, 0]), 
	];

	let quads = [
	];

	let boxes = [
	];

	return {
		spheres : spheres,
		quads : quads,
		boxes : boxes,
		triangles: [],
		meshes: [],
		backgroundColor1 : [0, 0.5, 1],
		backgroundColor2 : [1, 1, 1],
		focusDistance: 5,
		focusAngle: 0,
		sunIntensity: 1,
		samplesPerPixel: 1,
		maxBounces: 30
	};
}

async function Fuzz() 
{
	let spheres = [
		new Sphere([0, -1001, 0], [0.21568627450980393, 0.21568627450980393, 0.40784313725490196], 1000, [0, 0, 0, 0]), 
		new Sphere([0, -0.2, -2], [1, 0, 0], 0.5, [1, 0.1, 1, 0]), 
		new Sphere([-1, -0.5, -2], [1, 0, 0], 0.5, [1, 0.5, 1, 0]), 
		new Sphere([1, -0.5, -2], [1, 0, 0], 0.5, [1, 0, 1, 0]), 
	];

	let quads = [
	];

	let boxes = [
	];

	return {
		spheres : spheres,
		quads : quads,
		boxes : boxes,
		triangles: [],
		meshes: [],
		backgroundColor1 : [0, 0.3803921568627451, 0.7607843137254902],
		backgroundColor2 : [1, 1, 1],
		focusDistance: 5,
		focusAngle: 0,
		sunIntensity: 1,
		samplesPerPixel: 1,
		maxBounces: 30
	};
}

async function Specular() 
{
	let spheres = [
		new Sphere([0, -1001, 0], [0, 0.25098039215686274, 1], 1000, [0.74, 0, 1, 0]), 
		new Sphere([0, -0.5, -2], [1, 1, 1], 0.5, [1, 0, 0.1, 0]), 
		new Sphere([-1, -0.5, -2], [1, 1, 1], 0.5, [1, 0, 0.02, 0]), 
		new Sphere([1, -0.5, -2], [1, 0, 0], 0.5, [1, 0, 1, 0]), 
	];

	let quads = [
	];

	let boxes = [
		new Box([0, 1.54, -2, 0], [1, 1, 1], [0, 0, 0, 0], [1.3, 0.02, 0.36, 0], [0, 0, 0, 3]), 
	];

	return {
		spheres : spheres,
		quads : quads,
		boxes : boxes,
		triangles: [],
		meshes: [],
		backgroundColor1 : [0, 0, 0],
		backgroundColor2 : [0.34509803921568627, 0.6039215686274509, 0.9921568627450981],
		focusDistance: 5,
		focusAngle: 0,
		sunIntensity: 1,
		samplesPerPixel: 10,
		maxBounces: 30
	};
}

async function Emissive()
{
    let spheres = [
        groundDefault,
        new Sphere([.5, 0., -2.5], [1.0, 0.0, 0.0], 1.0, [0.0, 0.0, 0.0, 0.0]),
        new Sphere([-1.0, -0.5, -2.0], [1.0, 1.0, 1.0], 0.5, [0.0, 0.0, 0.0, 3.0]),
    ];

    return {
        spheres, 
        quads: [], 
        boxes: [], 
        triangles: [], 
        meshes: [], 
        backgroundColor1: [0.0, 0.0, 0.0], 
        backgroundColor2: [0.0, 0.0, 0.0],
        focusDistance: 5.0, 
        focusAngle: 0.0,
        sunIntensity: 0.0,
        samplesPerPixel: 1.0,
        maxBounces: 10.0
    };
}

async function Dielectric()
{
    let spheres = [
        groundDefault,
        new Sphere([0.0, -0.5, -4.0], [1.0, 0.0, 0.0], 0.5, [0.0, 0.0, 0.0, 0.0]),
        new Sphere([-0.2, 0.7, -4.0], [0.0, 0.0, 1.0], 0.5, [0.0, 0.0, 0.0, 0.0]),
        new Sphere([0.0, 0.0, -2.1], [1.0, 1.0, 1.0], 1, [-1.0, 0.0, 0.9, 0.0]),
    ];

    return {
        spheres, 
        quads: [], 
        boxes: [], 
        triangles: [], 
        meshes: [], 
        backgroundColor1: [0.0, 0.5, 1.0], 
        backgroundColor2: [1.0, 1.0, 1.0],
        focusDistance: 5.0, 
        focusAngle: 0.0,
        sunIntensity: 1.0,
        samplesPerPixel: 1.0,
        maxBounces: 10.0
    };
}

async function Cubes() 
{
	let spheres = [
		new Sphere([0, -1001, 0], [0.5, 0.5, 0.5], 1000, [0.9, 0, 0.6, 0]), 
		new Sphere([0, 0.49, -1.5], [0.4, 0.9, 0.8], 0.25, [1, 0, 1, 0]), 
	];

	let quads = [
	];

	let boxes = [
		new Box([-1, 0, -2.23, 0], [1, 0, 0], [0, 0, 0, 0], [0.5, 0.5, 0.5, 0], [0, 0, 0, 0]), 
		new Box([1, 0, -2.21, 0], [1, 1, 1], [0, 0, 0, 0], [0.5, 0.5, 0.5, 0], [0, 0, 0, 0]), 
	];

	return {
		spheres : spheres,
		quads : quads,
		boxes : boxes,
		triangles: [],
		meshes: [],
		backgroundColor1 : [0, 0.5, 1],
		backgroundColor2 : [1, 1, 1],
		focusDistance: 5,
		focusAngle: 0,
		sunIntensity: 1,
		samplesPerPixel: 1,
		maxBounces: 10
	};
}

async function Cornell() 
{
	let spheres = [
		new Sphere([-0.5, -0.4, -1.4], [1, 1, 1], 0.5, [0, 0, 0, 0]), 
		new Sphere([0.07, 0.42, -1.5], [0.4, 0.9, 0.8], 0.39, [1, 0, 0.7, 0]), 
	];

	let quads = [

		new Quad([-1, -1, 0, 0], [0, 0, -2, 0], [0, 2, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]), 

		new Quad([-1, -1, -2, 0], [2, 0, 0, 0], [0, 2, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]), 

		new Quad([-1, 1, -2, 0], [2, 0, 0, 0], [0, 0, 2, 0], [1, 1, 1, 1], [0, 0, 0, 0]), 

		new Quad([1, -1, -2, 0], [0, 0, 2, 0], [0, 2, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]), 

		new Quad([1, -1, -2, 0], [-2, 0, 0, 0], [0, 0, 2, 0], [1, 1, 1, 1], [0, 0, 0, 0]), 

		new Quad([1, -1, 0, 0], [-2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 1, 1], [0, 0, 0, 0]), 

		new Quad([-0.5, 0.99, -1.5, 0], [1, 0, 0, 0], [0, 0, 1, 0], [1, 1, 1, 1], [0, 0, 0, 5]), 
	];

	let boxes = [
		new Box([0.5, -0.5, -1.36, 0], [0.03137254901960784, 0.23529411764705882, 0.6509803921568628], [0, 0, 0, 0], [0.24, 0.5, 0.24, 0], [0.5, 0.5, 0.5, 0]), 
	];

	return {
		spheres : spheres,
		quads : quads,
		boxes : boxes,
		triangles: [],
		meshes: [],
		backgroundColor1 : [0, 0, 0],
		backgroundColor2 : [0, 0, 0],
		focusDistance: 5,
		focusAngle: 0,
		sunIntensity: 1,
		samplesPerPixel: 5,
		maxBounces: 10
	};
}

async function Mirror() 
{
	let spheres = [
		new Sphere([0.3, 0, -1.4], [0.023529411764705882, 0.9764705882352941, 0.7843137254901961], 0.5, [0, 0, 0, 0]), 
		new Sphere([-0.5, -0.4, -1.4], [0.34901960784313724, 0, 1], 0.3, [1, 0, 0.5, 0]), 
	];

	let quads = [

		new Quad([-1, -1, 0, 0], [0, 0, -2, 0], [0, 2, 0, 0], [1, 1, 1, 0], [1, 0.01, 1, 0]), 

		new Quad([-1, -1, -2, 0], [2, 0, 0, 0], [0, 2, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]), 

		new Quad([-1, 1, -2, 0], [2, 0, 0, 0], [0, 0, 2, 0], [1, 1, 1, 1], [0, 0, 0, 0]), 

		new Quad([1, -1, -2, 0], [0, 0, 2, 0], [0, 2, 0, 0], [1, 1, 1, 0], [1, 0.01, 1, 0]), 

		new Quad([1, -1, -2, 0], [-2, 0, 0, 0], [0, 0, 2, 0], [1, 1, 1, 1], [0, 0, 0, 0]), 

		new Quad([1, -1, 0, 0], [-2, 0, 0, 0], [0, 2, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]), 

		new Quad([-0.5, 0.99, -1.5, 0], [1, 0, 0, 0], [0, 0, 1, 0], [1, 1, 1, 1], [0, 0, 0, 2]), 
	];

	let boxes = [
	];

	return {
		spheres : spheres,
		quads : quads,
		boxes : boxes,
		triangles: [],
		meshes: [],
		backgroundColor1 : [0, 0, 0],
		backgroundColor2 : [0, 0, 0],
		focusDistance: 5,
		focusAngle: 0,
		sunIntensity: 1,
		samplesPerPixel: 3,
		maxBounces: 10
	};
}

async function Infinite() 
{
	let spheres = [
		new Sphere([0.3, 0, -1], [0.4, 0.9, 0.8], 0.3, [0, 0, 0, 0]), 
		new Sphere([-0.5, -0.4, -1], [1, 1, 1], -0.25, [0, 0, 0, 1]), 
		new Sphere([-0.32, 0.5, -1], [1, 0, 0], 0.2, [1, 0, 1, 0]), 
	];

	let quads = [

		new Quad([-1, -1, 0, 0], [0, 0, -2, 0], [0, 2, 0, 0], [1, 1, 1, 1], [1, 0.005, 1, 0]), 

		new Quad([-1, -1, -2, 0], [2, 0, 0, 0], [0, 2, 0, 0], [1, 1, 1, 1], [1, 0.005, 1, 0]), 

		new Quad([-1, 1, -2, 0], [2, 0, 0, 0], [0, 0, 2, 0], [1, 1, 1, 1], [1, 0.005, 1, 0]), 

		new Quad([1, -1, -2, 0], [0, 0, 2, 0], [0, 2, 0, 0], [1, 1, 1, 1], [1, 0.005, 1, 0]), 

		new Quad([1, -1, -2, 0], [-2, 0, 0, 0], [0, 0, 2, 0], [1, 1, 1, 1], [1, 0.005, 1, 0]), 

		new Quad([1, -1, 0, 0], [-2, 0, 0, 0], [0, 2, 0, 0], [1, 1, 1, 1], [1, 0.005, 1, 0]), 
	];

	let boxes = [
	];

	return {
		spheres : spheres,
		quads : quads,
		boxes : boxes,
		triangles: [],
		meshes: [],
		backgroundColor1 : [0, 0, 0],
		backgroundColor2 : [0, 0, 0],
		focusDistance: 5,
		focusAngle: 0,
		sunIntensity: 1,
		samplesPerPixel: 5,
		maxBounces: 10
	};
}

async function Bunny()
{
    let offset = [0, -1, -2];
    let spheres = [groundDefault];
    spheres = spheres.concat(getSpheresRandom(3, offset));

    let { verticesMesh, trianglesMesh, triangles } = await loadMesh('./media/stanford-bunny.obj');
    
    let meshes = [new Mesh([0, -1, -4], [2, 2, 2], [0, .2, 0], [0.4, 0.3, 0.6, 1.0], [1.0, 0.0, 0.5, 0.0], 0, 0, triangles.length)];
    let { min, max } = getObjBoundingBox(verticesMesh);
    meshes[0].setBoundingBox(min, max);

    return {
        spheres, 
        quads: [], 
        boxes: [], 
        triangles, 
        meshes, 
        backgroundColor1: [0.0, 0.5, 1.0], 
        backgroundColor2: [1.0, 1.0, 1.0], 
        focusDistance: 4.0, 
        focusAngle: 0.2,
        sunIntensity: 1.0,
        samplesPerPixel: 1.0,
        maxBounces: 10.0
    };
}

async function Suzzanne()
{
    let { verticesMesh, trianglesMesh, triangles } = await loadMesh('./media/suzanne.obj');
    let meshes = [new Mesh([0, 0.0, -6], [2, 2, 2], [0, 0, 0], [0.6, 0.3, 0.7, 1.0], [0.0, 0.0, 0.0, 0.0], 0, 0, triangles.length)];
    let { min, max } = getObjBoundingBox(verticesMesh);
    meshes[0].setBoundingBox(min, max);

    return {
        spheres: [], 
        quads: [], 
        boxes: [], 
        triangles, 
        meshes, 
        backgroundColor1: [0.0, 0.5, 1.0], 
        backgroundColor2: [1.0, 1.0, 1.0], 
        focusDistance: 5.0, 
        focusAngle: 0.2,
        sunIntensity: 1.0,
        samplesPerPixel: 1.0,
        maxBounces: 10.0
    };
}

async function Person() {
    let boxes = [
        // First row
        new Box([-0.75, -1, -2.75, 0], [1, 1, 1], [0, 0, 0, 0], [0.25, 1.2, 0.25, 0], [0, 0, 0, 0]),
        new Box([-0.25, -1, -2.75, 0], [0, 0, 0], [0, 0, 0, 0], [0.25, 1.2, 0.25, 0], [0, 0, 0, 0]),
        new Box([0.25, -1, -2.75, 0], [1, 1, 1], [0, 0, 0, 0], [0.25, 1.2, 0.25, 0], [0, 0, 0, 0]),
        new Box([0.75, -1, -2.75, 0], [0, 0, 0], [0, 0, 0, 0], [0.25, 1.2, 0.25, 0], [0, 0, 0, 0]),
    
        // Second row
        new Box([-0.75, -1, -2.25, 0], [0, 0, 0], [0, 0, 0, 0], [0.25, 0.8, 0.25, 0], [0, 0, 0, 0]),
        new Box([-0.25, -1, -2.25, 0], [1, 1, 1], [0, 0, 0, 0], [0.25, 0.8, 0.25, 0], [0, 0, 0, 0]),
        new Box([0.25, -1, -2.25, 0], [0.0, 0, 0], [0, 0, 0, 0], [0.25, 0.8, 0.25, 0], [0, 0, 0, 0]),
        new Box([0.75, -1, -2.25, 0], [1, 1, 1], [0, 0, 0, 0], [0.25, 0.8, 0.25, 0], [0, 0, 0, 0]),
    
        // Third row
        new Box([-0.75, -1, -1.75, 0], [1, 1, 1], [0, 0, 0, 0], [0.25, 0.4, 0.25, 0], [0, 0, 0, 0]),
        new Box([-0.25, -1, -1.75, 0], [0, 0, 0], [0, 0, 0, 0], [0.25, 0.4, 0.25, 0], [0, 0, 0, 0]),
        new Box([0.25, -1, -1.75, 0], [1, 1, 1], [0, 0, 0, 0], [0.25, 0.4, 0.25, 0], [0, 0, 0, 0]),
        new Box([0.75, -1, -1.75, 0], [0, 0, 0], [0, 0, 0, 0], [0.25, 0.4, 0.25, 0], [0, 0, 0, 0]),
    
        // Fourth row
        new Box([-0.75, -1, -1.25, 0], [0, 0, 0], [0, 0, 0, 0], [0.25, 0.0, 0.25, 0], [0, 0, 0, 0]),
        new Box([-0.25, -1, -1.25, 0], [1, 1, 1], [0, 0, 0, 0], [0.25, 0.0, 0.25, 0], [0, 0, 0, 0]),
        new Box([0.25, -1, -1.25, 0], [0, 0, 0], [0, 0, 0, 0], [0.25, 0.0, 0.25, 0], [0, 0, 0, 0]),
        new Box([0.75, -1, -1.25, 0], [1, 1, 1], [0, 0, 0, 0], [0.25, 0.0, 0.25, 0], [0, 0, 0, 0]),
    ];

	let spheres = [
		// First row
		new Sphere([-0.75, 0.3, -2.75], [1.0, 0.0, 0.0], 0.125, [1.0, 0.0, 0.1, 0.0]), // Bright red, reflective
		new Sphere([-0.25, 0.3, -2.75], [0.0, 1.0, 0.0], 0.125, [0.8, 0.2, 0.0, 0.5]), // Vibrant green, emissive
		new Sphere([0.25, 0.3, -2.75], [0.0, 0.0, 1.0], 0.125, [0.7, 0.3, 0.6, 0.0]), // Deep blue, glossy
		new Sphere([0.75, 0.3, -2.75], [1.0, 1.0, 0.0], 0.125, [0.6, 0.4, 0.0, 1.0]), // Bright yellow, emissive
	
		// Second row
		new Sphere([-0.75, -0.1, -2.25], [1.0, 0.5, 0.0], 0.125, [0.8, 0.2, 0.0, 0.7]), // Orange, emissive
		new Sphere([-0.25, -0.1, -2.25], [0.8, 0.0, 0.8], 0.125, [0.5, 0.5, 0.3, 0.0]), // Vibrant magenta, reflective
		new Sphere([0.25, -0.1, -2.25], [0.0, 1.0, 1.0], 0.125, [0.4, 0.6, 0.0, 0.8]), // Cyan, emissive
		new Sphere([0.75, -0.1, -2.25], [1.0, 0.0, 1.0], 0.125, [1.0, 0.7, 0.5, 0.0]), // Bright pink, emissive
	
		// Third row
		new Sphere([-0.75, -0.5, -1.75], [0.2, 0.6, 1.0], 0.125, [0.2, 0.8, 0.0, 0.7]), // Sky blue, emissive
		new Sphere([-0.25, -0.5, -1.75], [1.0, 1.0, 1.0], 0.125, [0.1, 0.9, 0.0, 1.0]), // Bright white, emissive
		new Sphere([0.25, -0.5, -1.75], [0.6, 0.2, 0.8], 0.125, [-1, 1.0, 0.0, 0.0]), // Purple, glossy
		new Sphere([0.75, -0.5, -1.75], [0.3, 1.0, 0.3], 0.125, [0.1, 0.0, 1.0, 0.0]), // Neon green, shiny
	
		// Fourth row
		new Sphere([-0.75, -0.9, -1.25], [1.0, 0.5, 0.2], 0.125, [1.0, 0.0, 0.0, 0.0]), // Peach, emissive
		new Sphere([-0.25, -0.9, -1.25], [0.2, 0.8, 0.8], 0.125, [0.9, 0.0, 0.1, 0.7]), // Aqua, emissive
		new Sphere([0.25, -0.9, -1.25], [1.0, 0.2, 0.2], 0.125, [0.5, 0.1, 0.2, 0.0]), // Coral red, matte
		new Sphere([0.75, -0.9, -1.25], [0.4, 0.4, 1.0], 0.125, [0.7, 0.3, 0.1, 1.0]), // Periwinkle, emissive
	];
	
	
	
	

    let quads = [
        new Quad([-1, -1, -1, 0], [0, 0, -2, 0], [0, 2, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]),
        new Quad([-1, -1, -3, 0], [2, 0, 0, 0], [0, 2, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]),
        new Quad([-1, 1, -3, 0], [2, 0, 0, 0], [0, 0, 2, 0], [1, 1, 1, 1], [0, 0, 0, 0]),
        new Quad([1, -1, -3, 0], [0, 0, 2, 0], [0, 2, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]),
        new Quad([1, -1, -1, 0], [-2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 1, 1], [0, 0, 0, 0]),
        new Quad([-0.5, 0.99, -2.5, 0], [1, 0, 0, 0], [0, 0, 1, 0], [1, 1, 1, 1], [0, 0, 0, 5]),
    ];

    return {
        spheres: spheres,
        quads: quads,
        boxes: boxes,
        triangles: [],
        meshes: [],
        backgroundColor1: [0, 0, 0],
        backgroundColor2: [0, 0, 0],
        focusDistance: 5,
        focusAngle: 0,
        sunIntensity: 1,
        samplesPerPixel: 3,
        maxBounces: 10,
    };
}

async function circular_plane() {
    let boxes = [
        // Define a circular plane at [0, 0, 0], oriented with the Y-axis
        new Box(
			[0, 0, -3],       // Plane center (slightly below origin)
			[1.0, 0.0, 0.0],  // Red color
			[0.0, 0.0, 0.5],  // Normal pointing upward
			[-2.0, 0.0, 0.0], // Radius of the circular plane (-2 triggers plane logic)
			[0.5, 0.5, 0.5, 0.5] // Material properties
		),		
    ];

    return {
        spheres: [],
        quads: [],
        boxes: boxes,
        triangles: [],
        meshes: [],
        backgroundColor1: [0.0, 0.0, 0.0],
        backgroundColor2: [0.0, 0.0, 0.0],
        focusDistance: 5.0,
        focusAngle: 0.0,
        sunIntensity: 1.0,
        samplesPerPixel: 1.0,
        maxBounces: 10.0
    };
}



export { getAvailableScene };