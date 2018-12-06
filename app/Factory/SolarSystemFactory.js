/**
 * SolarSystemFactory
 */

'use strict'

import randomColor from 'randomcolor';

import Moon from '../Model/Moon';
import Planet from '../Model/Planet';
import Sun from '../Model/Sun';

import OrbitController from '../Controller/OrbitController';
import RenderController from '../Controller/RenderController';
import keyboardController from '../Controller/KeyboardController';

import Scene from '../Modules/Scene';

import StarFactory from './StarFactory';
import AsteroidBeltFactory from './AsteroidBeltFactory';
import KuiperBeltFactory from './KuiperBeltFactory';
import KeyboardController from '../Controller/KeyboardController';

function SolarSystemFactory(data) {
	this.scene = new Scene();
	this.data = data || {};
	this.parent = data.parent || null;
	this.planets = data.planets || [];

	this.solarSystemObjects = {
		sun: null,
		planets: [],
		moons: [],
	}; 
}

SolarSystemFactory.prototype.build = function(data) {
	return new Promise((resolve) => {
		let startTime = new Date().getTime();

		let sun = this.buildSun(data.parent);
		this.solarSystemObjects.sun = sun;
		this.scene.add(sun.threeObject);

		let buildMap = {
			'1': {
				buildGroup: this.buildPlanets.bind(this, data.planets, sun),
				timeout: 1000
			},
			'2': {
				buildGroup: this.buildAsteroidBelt.bind(this, data),
				timeout: 1000
			},
			'3': {
				buildGroup: this.buildKuiperBelt.bind(this, data),
				timeout: 1000
			},
			'4': {
				buildGroup: this.buildStars.bind(this),
				timeout: 1000
			}
		};

		let buildGroupsCount = Object.keys(buildMap).length;
		let i = 0;

		function run() {
			i++;

			if (buildMap.hasOwnProperty(i)) {
				setTimeout(()=>{
					buildMap[i].buildGroup.call().then((response) => {
						run.call(this);
					})
				}, buildMap[i].timeout)
			} else {
				this.renderScene(startTime);
				resolve();
			}
		}

		run.call(this);
	});
};

SolarSystemFactory.prototype.renderScene = function(startTime) {
    let crosshair = new THREE.Mesh(
        new THREE.RingBufferGeometry( 0.02, 0.04, 32 ),
        new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            opacity: 0.5,
            transparent: true
        } )
    );
    crosshair.position.z = -2;
	this.scene.camera.add(crosshair);
	
    this.scene.cameraWrapper.position.set(60000,0,15000);
    this.scene.cameraWrapper.lookAt(new THREE.Vector3())
    this.scene.cameraWrapper.updateMatrixWorld();

    console.log('camera desu', this.scene.cameraWrapper.uuid);

    this.scene.add(this.scene.cameraWrapper)
	console.log(crosshair);

    let renderController = new RenderController(this.scene);
    let keyboardController = new KeyboardController({
        scene: this.scene,
        sceneObjects: this.solarSystemObjects
	});


    document.onkeypress = keyboardController.handleKeyDown.bind(keyboardController);
    document.onkeyup = keyboardController.handleKeyUp.bind(keyboardController);

    //text for object name
	var text = "Merkurius",
		height = 1, //height kebelakang
		size = 4,
		hover = 85, //makin besar, makin kebawah
		curveSegments = 4,
		bevelThickness = 0.07,
		bevelSize = 0.27, //tumpukan makin besar
		bevelSegments = 7, // makin halus
		bevelEnabled = true,
		font = undefined;
		// fontName = "helvetiker",
		// fontWeight = "bold";

	var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
	pointLight.position.set( 0, 100, 90 );
	this.scene.add( pointLight );

	function decimalToHex( d ) {
		var hex = Number( d ).toString( 16 );
		hex = "000000".substr( 0, 6 - hex.length ) + hex;
		return hex.toUpperCase();
	}

	var hex, materials, group, textGeo, textMesh1, textMesh2;
	var mirror = true;

	function createText(){
	textGeo = new THREE.TextGeometry( text, {
		font: font,
		size: size,
		height: height,
		curveSegments: curveSegments,
		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled
	} );
	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();
	
	if ( ! bevelEnabled ) {
		var triangleAreaHeuristics = 0.1 * ( height * size );
		for ( var i = 0; i < textGeo.faces.length; i ++ ) {
			var face = textGeo.faces[ i ];
			if ( face.materialIndex == 1 ) {
				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
					face.vertexNormals[ j ].z = 0;
					face.vertexNormals[ j ].normalize();
				}
				var va = textGeo.vertices[ face.a ];
				var vb = textGeo.vertices[ face.b ];
				var vc = textGeo.vertices[ face.c ];
				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
				if ( s > triangleAreaHeuristics ) {
					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
						face.vertexNormals[ j ].copy( face.normal );
					}
				}
			}
		}
	}
	var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
	textMesh1 = new THREE.Mesh( textGeo, materials );
	textMesh1.position.x = centerOffset;
	textMesh1.position.y = hover;
	textMesh1.position.z = 0;
	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;
	group.add( textMesh1 );
	if ( mirror ) {
		textMesh2 = new THREE.Mesh( textGeo, materials );
		textMesh2.position.x = centerOffset;
		textMesh2.position.y = - hover;
		textMesh2.position.z = -55;
		textMesh2.rotation.x = THREE.Math.degToRad(180);
		textMesh2.rotateX(THREE.Math.degToRad(180));
		textMesh2.rotation.y = Math.PI * 2;
		// THREE.Math.degToRad()
		group.add( textMesh2 );
	}
	console.log("text created !");
	console.log(textGeo);
	// textGeo.position.z = -100;
	// console.log("after z updated");
	}
	function loadFont() {
		var loader = new THREE.FontLoader();
		loader.load( '../assets/font/helvetiker_bold.typeface.json', function ( response ) {
			font = response;
			createText();
		} );
	}

	var hash = document.location.hash.substr( 1 );
	if ( hash.length !== 0 ) {
		var colorhash = hash.substring( 0, 6 );
		var fonthash = hash.substring( 6, 7 );
		var weighthash = hash.substring( 7, 8 );
		var bevelhash = hash.substring( 8, 9 );
		var texthash = hash.substring( 10 );
		hex = colorhash;
		pointLight.color.setHex( parseInt( colorhash, 16 ) );
		// fontName = reverseFontMap[ parseInt( fonthash ) ];
		// fontWeight = reverseWeightMap[ parseInt( weighthash ) ];
		bevelEnabled = parseInt( bevelhash );
		text = decodeURI( texthash );
		// updatePermalink();
	} else {
		pointLight.color.setHSL( Math.random(), 1, 0.5 );
		hex = decimalToHex( pointLight.color.getHex() );
	}
	materials = [
		new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
	];
	group = new THREE.Group();
	group.position.y = 100;
	this.scene.camera.add( group );

	loadFont();
	// var loader = new THREE.FontLoader();
	// loader.laod('../assets/font/helvetiker_bold.typeface.json', function(font){
	//     var geom = new THREE.TextGeometry('planet Merkurius', {
	//         font: font,
	//         size: 80,
	//         height: 5,
	//         curveSegments: 12,
	//         bevelEnabled: true,
	//         bevelThickness: 10,
	//         bevelSize: 8,
	//         bevelSegments: 5
	//     });
	// });
	console.log("after text created");

	// infografis


	function makeTextSprite( message, parameters )
	{
		if ( parameters === undefined ) parameters = {};
		
		var fontface = parameters.hasOwnProperty("fontface") ? 
			parameters["fontface"] : "Arial";
		
		var fontsize = parameters.hasOwnProperty("fontsize") ? 
			parameters["fontsize"] : 18;
		
		var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
			parameters["borderThickness"] : 4;
		
		var borderColor = parameters.hasOwnProperty("borderColor") ?
			parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
		
		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
			parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
		// var spriteAlignment = THREE.SpriteAlignment.topLeft;
			
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;
	    
		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;
		
		// background color
		context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
									  + backgroundColor.b + "," + backgroundColor.a + ")";
		// border color
		context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
									  + borderColor.b + "," + borderColor.a + ")";
		context.lineWidth = borderThickness;
		roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
		// 1.4 is extra height factor for text below baseline: g,j,p,q.
		
		// text color
		context.fillStyle = "rgba(0, 0, 0, 1.0)";
		context.fillText( message, borderThickness, fontsize + borderThickness);

		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;
		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture, color: 0xffffff } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(100,50,1.0);
		return sprite;	
	}
	// function for drawing rounded rectangles
	function roundRect(ctx, x, y, w, h, r) 
	{
	    ctx.beginPath();
	    ctx.moveTo(x+r, y);
	    ctx.lineTo(x+w-r, y);
	    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
	    ctx.lineTo(x+w, y+h-r);
	    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
	    ctx.lineTo(x+r, y+h);
	    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
	    ctx.lineTo(x, y+r);
	    ctx.quadraticCurveTo(x, y, x+r, y);
	    ctx.closePath();
	    ctx.fill();
		ctx.stroke();   
	}

	var spritey = makeTextSprite( " World! ", 
		{ fontsize: 100, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	spritey.position.set(0,0,0);
	console.log("text sprite created");
	this.scene.camera.add(spritey);

	// var sprite = new SpriteText2D("SPRITE", { align: textAlign.center,  font: '40px Arial', fillStyle: '#000000' , antialias: false })
	// this.scene.add(sprite)

	// var SpriteText2D = THREE_Text.SpriteText2D;
	// this.sprite = new SpriteText2D("SPRITE", { align: textAlign.center, font: '30px Arial', fillStyle: '#000000'})
	// this.sprite.position.set(0, -200, 0)
	// this.sprite.scale.set(1.5, 1.5, 1.5)
	// this.sprite.material.alphaTest = 0.1
	// this.scene.add(this.sprite)
}

SolarSystemFactory.prototype.buildMoons = function(planetData, planet) {
	for(let i = 0; i < planetData.satellites.length; i++) {
		let orbitColor = randomColor({
			luminosity: 'light',
			format: 'hex',
			hue: 'blue'
		});

		let moon = new Moon(planetData.satellites[i], planet, planetData, orbitColor);
		let orbitControlMoon = new OrbitController(moon)

		this.solarSystemObjects.moons.push(moon);

		planet._moons.push(moon);
		planet.core.add(moon.orbitCentroid);
	}
}

SolarSystemFactory.prototype.buildPlanet = function(data, sun) {
	return new Promise((resolve) => {
		let planet = new Planet(data, sun);
		let orbitControllerPlanet = new OrbitController(planet);

		this.scene.add(planet.orbitCentroid);

		if (data.satellites.length) {
			this.buildMoons(data, planet);
		}

		this.solarSystemObjects.planets.push(planet);

		resolve(planet);
	})
}

SolarSystemFactory.prototype.buildPlanets = function(planets, sun) {
	return new Promise((resolve) => {
		let promises = [];

		for(let i = 0; i < planets.length; i++) {
			promises.push(this.buildPlanet(planets[i], sun).then((planet) => {
				this.solarSystemObjects.planets.push(planet);
			}))
		}

		Promise.all(promises).then(()=> {
			resolve({
				group: 'planets'
			})
		})
	})
}

SolarSystemFactory.prototype.buildSun = function(parentData) {
	let sun = new Sun(parentData);

	this.solarSystemObjects.sun = sun;

	return sun;
}

SolarSystemFactory.prototype.buildStars = function() {
	let starFactory = new StarFactory(this.scene);

	return new Promise((resolve)=> {
		starFactory.buildStarField().then(()=> {
			resolve({
				group: 'stars',
			});
		});
	});
};

SolarSystemFactory.prototype.buildKuiperBelt = function(data) {
	let kuiperBeltFactory = new KuiperBeltFactory(this.scene, data);

	return new Promise((resolve)=> {
		kuiperBeltFactory.build().then(()=> {
			resolve({
				group: 'kuiper',
			});
		})
	});
};

SolarSystemFactory.prototype.buildAsteroidBelt = function(data) {
	let asteroidBeltFactory = new AsteroidBeltFactory(this.scene, data);

	return new Promise((resolve)=> {
		asteroidBeltFactory.build().then(()=> {
			resolve({
				group: 'asteroids',
			});
		})
	});
};



export default SolarSystemFactory;