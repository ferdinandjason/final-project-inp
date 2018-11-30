'use strict'

import * as THREE from 'three';

class CelestialObject {
    constructor(diameter, mass, gravity, density) {
        this._diameter = diameter || 1;
        this._mass = mass || 1;
        this._gravity = gravity || 1;
        this._density = density || 1;
        this._core = new THREE.Group();
        this._objectCentroid = new THREE.Group();
    }

    /**
     * CelestialObject Data
     */

    get core() {
        return this._core;
    }

    get diameter() {
        return this._diameter;
    }

    get mass() {
        return this._mass;
    }

    get gravity() {
        return this._gravity;
    }

    get density() {
        return this._density;
    }

    get objectCentroid() {
        return this._objectCentroid;
    }
}

export default CelestialObject;