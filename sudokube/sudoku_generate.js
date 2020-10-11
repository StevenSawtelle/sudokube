import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { getMaterialArray } from './texture_maps.js';
import {generate, generateGivenPartialSeed, getKeysStartsWith, getKeysEndsWith, swapOneThroughNine, swapItoA, makeStartWith, makeStartWithNormal, makeEndWith, noConflicts, no3x3Errors} from './get_grid.js';

const MAX_RETRIES_PER_FACE = 10;
var camera, controls, scene, renderer, cubes;
let topGridObj = {}, backGridObj = {}, frontGridObj = {}, botGridObj = {}, leftGridObj = {}, rightGridObj = {};
let topFullGrid = {}, backFullGrid = {}, frontFullGrid = {}, botFullGrid = {}, leftFullGrid = {}, rightFullGrid = {};
let topGrid = [], backGrid = [], frontGrid = [], botGrid = [], leftGrid = [], rightGrid = [];
let generated = false;
let generateAttempts = 1;
while(!generated){
	console.log(`Generate cube attempt ${generateAttempts}`);
	generateAttempts += 1;
	//reset
	topGridObj = {}, backGridObj = {}, frontGridObj = {}, botGridObj = {}, leftGridObj = {}, rightGridObj = {};
	topFullGrid = {}, backFullGrid = {}, frontFullGrid = {}, botFullGrid = {}, leftFullGrid = {}, rightFullGrid = {};
	topGrid = [], backGrid = [], frontGrid = [], botGrid = [], leftGrid = [], rightGrid = [];
	
	//top
	topGridObj = generate("easy", {});
	topGrid = topGridObj.convertedGrid;
	topFullGrid = topGridObj.fullGrid;
	//back
	let validBack = false;
	let backCount = 1;
	while(!validBack){
		console.log(`Generating back permutation #${backCount}`);
		backCount += 1;
		backGridObj = generate("easy", swapOneThroughNine(getKeysStartsWith(topFullGrid, "A")));
		backGrid = backGridObj.convertedGrid;
		backFullGrid = backGridObj.fullGrid;
		validBack = no3x3Errors(backFullGrid["B1"], backFullGrid["C1"], topFullGrid["B9"], topFullGrid["C9"])
			&& no3x3Errors(backFullGrid["B9"], backFullGrid["C9"], topFullGrid["B1"], topFullGrid["C1"]);
	}
	//front
	let validFront = false;
	let frontCount = 1;
	while(!validFront){
		if(frontCount > MAX_RETRIES_PER_FACE){
			break;
		}
		console.log(`Generating front permutation #${frontCount}`);
		frontCount += 1;
		frontGridObj = generate("easy", makeStartWithNormal(getKeysStartsWith(topFullGrid, "I"), "A"));
		frontGrid = frontGridObj.convertedGrid;
		frontFullGrid = frontGridObj.fullGrid;
		// after generating front, only continue if there are no issues in the following:
		// across the left face (1 col of front to 9 col of back)
		// across the right face (9 col of front to 1 col of back)
		// across the bot face (I row of front to I row of back)
		validFront = noConflicts(getKeysEndsWith(frontFullGrid, "1"), makeEndWith(getKeysEndsWith(backFullGrid, "9"), "1"))
			&& noConflicts(getKeysEndsWith(frontFullGrid, "9"), makeEndWith(getKeysEndsWith(backFullGrid, "1"), "9"))
			&& noConflicts(getKeysStartsWith(frontFullGrid, "I"), swapOneThroughNine(getKeysStartsWith(backFullGrid, "I")))
			&& no3x3Errors(frontFullGrid["B1"], frontFullGrid["C1"], topFullGrid["G1"], topFullGrid["H1"])
			&& no3x3Errors(frontFullGrid["B9"], frontFullGrid["C9"], topFullGrid["G9"], topFullGrid["H9"]);
	}
	if(!validFront){
		continue;
	}

	//bottom - starting to get diceyyy
	let validBot = false;
	let botCount = 1;
	let botTemplate = Object.assign({},
		makeStartWithNormal(getKeysStartsWith(frontFullGrid, "I"), "A"),
		swapOneThroughNine(getKeysStartsWith(backFullGrid, "I"))
	);
	console.log(botTemplate)
	while(!validBot){
		if(botCount > MAX_RETRIES_PER_FACE){
			break;
		}
		console.log(`Generating bot permutation #${botCount}`);
		botCount += 1;
		botGridObj = generate("easy", botTemplate);
		botGrid = botGridObj.convertedGrid;
		botFullGrid = botGridObj.fullGrid;
		// after generating bot, only continue if there are no issues in the following:
		// across the left face (1 col of front to 9 col of back)
		// across the right face (9 col of front to 1 col of back)
		validBot = noConflicts(getKeysStartsWith(botFullGrid, "A"), swapOneThroughNine(getKeysStartsWith(topFullGrid, "A")))
			&& noConflicts(getKeysStartsWith(botFullGrid, "I"), swapOneThroughNine(getKeysStartsWith(topFullGrid, "I")))
			&& no3x3Errors(botFullGrid["B1"], botFullGrid["C1"], frontFullGrid["G1"], frontFullGrid["H1"])
			&& no3x3Errors(botFullGrid["B9"], botFullGrid["C9"], frontFullGrid["G9"], frontFullGrid["H9"])
			&& no3x3Errors(botFullGrid["G1"], botFullGrid["H1"], backFullGrid["G9"], backFullGrid["H9"])
			&& no3x3Errors(botFullGrid["G9"], botFullGrid["H9"], backFullGrid["G1"], backFullGrid["H1"]);
	}
	if(!validBot){
		continue;
	}
	//left - oh boi
	let leftTemplate = Object.assign({},
		makeStartWith(getKeysEndsWith(topFullGrid, "1"), "A"),//top
		makeEndWith(getKeysEndsWith(backFullGrid, "9"), "1"),//back
		makeEndWith(getKeysEndsWith(frontFullGrid, "1"), "9"),//front
		swapOneThroughNine(makeStartWith(getKeysEndsWith(botFullGrid, "1"), "I"))//bot
	);

	console.log(topFullGrid)
	console.log(frontFullGrid)
	console.log(backFullGrid)
	console.log(botFullGrid)
	console.log(makeStartWith(getKeysEndsWith(topFullGrid, "1"), "A"))
	console.log(makeEndWith(getKeysEndsWith(backFullGrid, "9"), "1"))
	console.log(makeEndWith(getKeysEndsWith(frontFullGrid, "1"), "9"))
	console.log(swapOneThroughNine(makeStartWith(getKeysEndsWith(botFullGrid, "1"), "I")))
	console.log(leftTemplate);
	leftGridObj = generate("easy", leftTemplate);
	leftGrid = leftGridObj.convertedGrid;
	leftFullGrid = leftGridObj.fullGrid;
	//right - oh boi pt 2 electric boogaloo
	let rightTemplate = Object.assign({},
		swapOneThroughNine(makeStartWith(getKeysEndsWith(topFullGrid, "9"), "A")),//top
		makeEndWith(getKeysEndsWith(backFullGrid, "1"), "9"),//back
		makeEndWith(getKeysEndsWith(frontFullGrid, "9"), "1"),//front
		makeStartWith(getKeysEndsWith(botFullGrid, "9"), "I")//bot
	);
	console.log(rightTemplate);
	rightGridObj = generate("easy", rightTemplate);
	rightGrid = rightGridObj.convertedGrid;
	rightFullGrid = rightGridObj.fullGrid;

	// we did it reddit!
	generated = true;
}

console.log("generated the following grids!")
console.log("top")
console.log(topGrid)
console.log("back")
console.log(backGrid)
console.log("front")
console.log(frontGrid)
console.log("bot")
console.log(botGrid)
console.log("left")
console.log(leftGrid)
console.log("right")
console.log(rightGrid)


init();
animate();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
function init() {
	renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcccccc );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 400, 200, 0 );
	// camera.position.set( 15, 15, 15 );
	camera.lookAt(scene.position);
	// controls
	controls = new OrbitControls( camera, renderer.domElement );
	controls.enableRotate = true;
	//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
	// controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	// controls.dampingFactor = 0.05;
	// controls.screenSpacePanning = false;
	// controls.minDistance = 100;
	// controls.maxDistance = 500;
	// controls.maxPolarAngle = Math.PI ;
	// world
	var off_x = -90;
	var off_y = 0;
	var off_z = -90;

	cubes = new THREE.Group();
	scene.add(cubes)


	let small_offset = 25;
	let extra_offset = 6;
	let cube_size = 20;

	for(var depth=1; depth <= 9; depth++){
		for ( var i = 1; i <= 9; i ++ ) {
			for(var j = 1; j <= 9; j++){

				let curVal = getVal(i,j,depth);
				let materialArray = getMaterialArray(curVal, false);
				var geometry = new THREE.CubeGeometry( cube_size,cube_size,cube_size );
				var cube = new THREE.Mesh( geometry, materialArray );
				cube.row = i;
				cube.col = j;
				cube.depth = depth;
				cube.val = curVal;

				cube.position.x = off_x;
				cube.position.y = off_y;
				cube.position.z = off_z;
				// cube.material.color.setHex( 0xffffff );

				off_x += small_offset;
				if(j % 3 == 0){
					off_x += extra_offset;
				}
				// if(i % 9 == 0){
				// 	off_x = -90;
				// 	off_z += 21;
				// }

				// cube.updateMatrix();
				// cube.matrixAutoUpdate = false;
				if(isValidCube(cube)){
					cubes.add(cube);
				}
				// scene.add( cubes );

			}
			if(i % 3 == 0){
				off_z += extra_offset;
			}
			off_x = -90;
			off_z += small_offset;
		}
		off_x = -90;
		off_z = -90;
		off_y += small_offset + extra_offset;
	}
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'click', onClick, false );
	window.addEventListener( 'keypress', onKeyDown, false );

	// window.requestAnimationFrame(render);
}

function getVal(row, col, depth){
	if(depth === 9){//top
		//starts at 1,1
		return topGrid[row-1][col-1];
	}
	if(row === 1){//back
		// top left 9(depth),9(col) bottom right 1,1
		return backGrid[9-depth][9-col];
	}
	if(row === 9){//front
		//top left 1(col),9(depth)
		return frontGrid[9-depth][col-1];
	}
	if(depth === 1){//bot
		//top left
		return botGrid[9-row][col-1];
	}
	if(col === 1){//left
		//top left
		return leftGrid[9-depth][row-1];
	}
	if(col === 9){//right
		//top left
		return rightGrid[9-depth][9-row];
	}
	//default
	return -1;//error
}

function onKeyDown(event){
	if(event.keyCode >= 49 && event.keyCode <= 57){
		if(event.keyCode == 49){//1
			clickedObject.val = 1;
		}else if(event.keyCode == 50){//2
			clickedObject.val = 2;
		}else if(event.keyCode == 51){//3
			clickedObject.val = 3;
		}else if(event.keyCode == 52){//4
			clickedObject.val = 4;
		}else if(event.keyCode == 53){//5
			clickedObject.val = 5;
		}else if(event.keyCode == 54){//6
			clickedObject.val = 6;
		}else if(event.keyCode == 55){//7
			clickedObject.val = 7;
		}else if(event.keyCode == 56){//8
			clickedObject.val = 8;
		}else if(event.keyCode == 57){//9
			clickedObject.val = 9;
		}
		let materialArray = getMaterialArray(clickedObject.val, false);
		clickedObject.material = materialArray;
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

var selectedObject = null;
var clickedObject = null;
function onClick(){
	if(selectedObject){
		clickedObject = selectedObject;
		console.log(selectedObject.row + ", " + selectedObject.col + ", " + selectedObject.depth);
	}
}

function animate() {
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

function onMouseMove( event ) {
	event.preventDefault();
	// if ( selectedObject ) {
	// 	let materialArray = getMaterialArray(selectedObject.val, false);
	// 	selectedObject.material = materialArray;
	// 	// selectedObject.material.color.set( '#fff' );
	// 	selectedObject = null;
	// }
	var intersects = getIntersects( event.layerX, event.layerY );
	if ( intersects.length > 0 ) {
		var res = intersects.filter( function ( res ) {
			return res && res.object;
		} )[ 0 ];
		if ( res && res.object ) {
			selectedObject = res.object;
		// let materialArray = getMaterialArray(selectedObject.val, true);
		// selectedObject.material = materialArray;
		}
	}
}

var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3();
function getIntersects( x, y ) {
	x = ( x / window.innerWidth ) * 2 - 1;
	y = - ( y / window.innerHeight ) * 2 + 1;
	mouseVector.set( x, y, 0.5 );
	raycaster.setFromCamera( mouseVector, camera );
	return raycaster.intersectObject( cubes, true );
}

function isValidCube(cube) {
	return cube.row === 1 ||
		cube.row === 9 ||
		cube.col === 1 ||
		cube.col === 9 ||
		cube.depth === 1 ||
		cube.depth === 9;
}