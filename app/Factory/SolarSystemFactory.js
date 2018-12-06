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

import objectText from './objectText';

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