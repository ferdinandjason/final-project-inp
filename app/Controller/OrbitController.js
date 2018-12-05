'use strict'

import Clock from '../Modules/Clock';

window.clock = new Clock({});
let prevTime = 0;

window.clock.start();
window.clock.stop();

const COORDINATE_PRECISION = 12;

class OrbitController {
    constructor(object) {
        this._object = object;
        this._distanceFromParent = object.threeDistanceFromParent;
        this._segmentsInDay = 1;
        this._currentDay = 1;
        this._orbitAmplitude = this._object.threeParent ? this._object.threeParent.threeRadius + this._distanceFromParent : 1000;
        this._degreesToRotate = 0.1 * Math.PI / 180;
        this._orbitPositionOffset = object.orbitPositionOffset || 0;
        this._theta = 0;
        this._date = new Date();

        this.initListeners();

        this._first = true;
    }

    initListeners() {
        this.positionObject();
        document.addEventListener('frame', (e) => {
            this.positionObject();
            this.rotateObject();
        }, false);
    }

    positionObject() {
        let dayOfYear = this._date.getDOYwithTimeAsDecimal();
        let time = (dayOfYear + (clock.getElapsedTime() / 60)) + this._orbitPositionOffset;
        let theta = THREE.Math.degToRad(time * (360 / this._object.orbitalPeriod));
        
        let x = this._orbitAmplitude * Math.cos(theta);
        let y = this._orbitAmplitude * Math.sin(theta);

        this._object.theta = theta;

        x = Number.parseFloat(x.toFixed(COORDINATE_PRECISION));
        y = Number.parseFloat(y.toFixed(COORDINATE_PRECISION));

        this._object.threeObject.position.set(x, y, 0);
        this._object.core.position.set(x, y, 0);
        
        this.setOrbitInclination();

        var timeParsed = Number.parseInt(time);

        if (timeParsed > 0 && timeParsed % 60 === 0) {
            clock = new Clock(true);
        }
    }

    rotateObject(){
        this._object.threeObject.rotation.z += this._degreesToRotate;
    }

    setOrbitInclination() {
        this._object.orbitCentroid.rotation.set(THREE.Math.degToRad(this._object.orbitalInclination), 0, 0);
        this._object.orbitCentroid.updateMatrixWorld();
    }
}

export default OrbitController;