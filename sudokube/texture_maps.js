// import * as THREE from './three.module.js';

import {
	MeshBasicMaterial,
	TextureLoader
} from "./three.module.js";

const pickedMap = {'.':"none_unpicked.png",
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

var loader = new TextureLoader();
loader.setPath( './sudokube/textures/' );

var getMaterialArray = function ( num, isPicked ) {
	let tex = "";
	if(isPicked){
		tex = pickedMap[num];
	}else{
		tex = pickedMap[num];
		// tex = unpickedMap[num];
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

export { getMaterialArray };