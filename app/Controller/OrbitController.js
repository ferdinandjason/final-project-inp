'use strict'

import Clock from '../Modules/Clock';

window.clock = new Clock({});
let prevTime = 0;

window.clock.start();
window.clock.stop();

import * as THREE from 'three';

const COORDINATE_PRECISION = 12;

function getTimeAsDecimal(){
    let date = new Date();
    let onejan = new Date(date.getFullYear(), 0, 1);

    let dayOfYear = Math.ceil((this - onejan) / 86400000);

    let timeString      = new Date(Date.now()).toDateString(),
        hoursMinutes    = timeString.split(/[.:]/),
        hours           = Number.parseInt(hoursMinutes[0], 10),
        minutes         = hoursMinutes[1] ? Number.parseInt(hoursMinutes[1], 10) : 0;

    let timeDecimal = hours + minutes / 60;

    return dayOfYear + timeDecimal / 24;
}

class OrbitController {
    constructor(object) {
        this._object = object;
        this._threePlanet = object.threeObject;
        this._distanceFromParent = object.threeDistanceFromParent;
        this._segmentsInDay = 1;
        this._currentDay = 1;
        this._orbitAmplitude = this._object.threeParent ? this._object.threeParent.threeRadius + this._distanceFromParent : 1000;
        this._degreesToRotate = 0.1 * Math.PI / 180;
        this._orbitPositionOffset = object.orbitPositionOffset || 0;
        this._theta = 0;

        this.initListeners();
    }

    initListeners() {
        this.positionObject();
        document.addEventListener('frame', (e) => {
            this.positionObject();
            this.rotateObject();
        }, false);
    }

    positionObject() {
        let dayOfYear = new Date().getDOYwithTimeAsDecimal();
        let time = (dayOfYear + (clock.getElapsedTime() / 60)) + this._orbitPositionOffset;
        let theta = THREE.Math.degToRad(time * (360 / this._object.orbitalPeriod));

        let x = this._orbitAmplitude * Math.cos(theta);
        let y = this._orbitAmplitude * Math.sin(theta);

        this._object.theta = theta;

        x = Number.parseFloat(x.toFixed(COORDINATE_PRECISION));
        y = Number.parseFloat(y.toFixed(COORDINATE_PRECISION));

        this._threePlanet.position.set(x, y, 0);
        this._object.core.position.set(x, y, 0);

        if (this._object.objectCentroid) {
            this._object.objectCentroid.position.set(x, y, 0);
        }
    }

    rotateObject(){
        this._threePlanet.rotation.z += this._degreesToRotate;
    }
}

export default OrbitController;