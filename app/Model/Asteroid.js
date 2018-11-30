'use strict'

import * as THREE from 'three';;

import CelestialObject from  './CelestialObject';

const ASTEROID_EMMESIVE_COLOR = '0xfffff';

class Asteroid extends CelestialObject {
    constructor(index, texture) {
        super();

        this._texture = texture;
        this._id = index || String(Math.random()).slice(1, 4);
        this._threeObject = this.createGeometry();
        this._orbitInclination = this.createHypotheticalOrbitInclination(index);// (Math.random() * this._randomNumberGenerator.getRandomNumberWithinRange(1, 15) / 90);
        this._orbitCentroid = new THREE.Group();
        this._orbitCentroid.rotation.x = this._orbitInclination;
        this._orbitCentroid.add(this._threeObject);
    }

    get threeObject() {
        return this._threeObject;
    }

    get orbitCentroid() {
        return this._orbitCentroid;
    }

    createHypotheticalOrbitInclination(index) {
        let isOdd = index % 2;
        let degress = Math.random() * 3; // get random number in range 1 to 3

        if (isOdd) degress *= -1;

        return THREE.Math.degToRad(degress);
    }

    createGeometry() {
        let materials = [
            new THREE.MeshPhongMaterial({map: this._texture}),
            new THREE.MeshLambertMaterial({
                emissive: ASTEROID_EMMESIVE_COLOR,
                transparent: true,
                opacity: 0.2,
                wireframe: true,
            })
        ];

        return new THREE.SceneUtils.createMultiMaterialObject(
            new THREE.TetrahedronGeometry(7),
            materials,
        );
    }
}

export default Asteroid;