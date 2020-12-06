// import * as THREE from './three.module.js';

import {
	Mesh,
	MeshBasicMaterial,
	TextureLoader
} from "./three.module.js";

const pickedMap = {'.':"none_picked.png",
					1:"1_picked.png",
					2:"2_picked.png",
					3:"3_picked.png",
					4:"4_picked.png",
					5:"5_picked.png",
					6:"6_picked.png",
					7:"7_picked.png",
					8:"8_picked.png",
					9:"9_picked.png",
					};

const unpickedMap = {'.':"none_unpicked.png",
					1:"1_unpicked.png",
					2:"2_unpicked.png",
					3:"3_unpicked.png",
					4:"4_unpicked.png",
					5:"5_unpicked.png",
					6:"6_unpicked.png",
					7:"7_unpicked.png",
					8:"8_unpicked.png",
					9:"9_unpicked.png",
					};

const givenMap = {'.':"none_unpicked.png",
					1:"1_given.png",
					2:"2_given.png",
					3:"3_given.png",
					4:"4_given.png",
					5:"5_given.png",
					6:"6_given.png",
					7:"7_given.png",
					8:"8_given.png",
					9:"9_given.png",
					};

var loader = new TextureLoader();
loader.setPath( './sudokube/textures/' );

var getMaterialArray = function ( num, cubeType ) {
	let tex = "";
	switch(cubeType){
		case "given":
			tex = givenMap[num];
			break;
		case "picked":
			tex = pickedMap[num];
			break;
		case "unpicked":
			tex = unpickedMap[num];
			break;
	}
	return [
		    new MeshBasicMaterial( { map: loader.load(tex) } ),
		    new MeshBasicMaterial( { map: loader.load(tex) } ),
		    new MeshBasicMaterial( { map: loader.load(tex) } ),
		    new MeshBasicMaterial( { map: loader.load(tex) } ),
		    new MeshBasicMaterial( { map: loader.load(tex) } ),
		    new MeshBasicMaterial( { map: loader.load(tex) } ),
		];
}

var getCenterMaterialArray = function () {
	return new MeshBasicMaterial( { map: loader.load("center_cube.png") } );
}

export { getMaterialArray, getCenterMaterialArray };