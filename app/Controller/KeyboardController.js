'use strict'

import * as THREE from 'three';

const ORBIT_COLOR_DEFAULT = '#424242';
const ORBIT_COLOR_HIGHLIGHT = '#197eaa';
const ORBIT_COLOR_ACTIVE = '#3beaf7';

class KeyboardController {
    constructor(options){
        this.scene = options.scene || null;
        this.sceneObjects = options.sceneObjects || {};
        this.lastKeyCode = 0;
        this.isTravel = false;
    }

    handleKeyDown(event) {
        if(event.keyCode == this.lastKeyCode) return;
        console.log(event.keyCode);
        switch(event.keyCode){
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                console.log(this.isTravel);
                if(!this.isTravel){
                    this.highlightPlanet(event.keyCode);
                } else {
                    this.travel(event.keyCode);
                }
                break;
            case 116:
                this.isTravel = !this.isTravel;
                console.log(this.isTravel);
                break;
        }
        this.lastKeyCode = event.keyCode;
    }

    travel(id){
        let target = this.matchTarget(id-48);
        console.log(target.threeObject.position);
        this.scene.camera.position.x = target.threeObject.position.x - 5;
        this.scene.camera.position.y = target.threeObject.position.y - 0;
        this.scene.camera.position.z = target.threeObject.position.z - 0;
        this.scene.camera.lookAt(target.threeObject.position);
    }

    handleKeyUp(event) {
        switch(event.keyCode){
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                this.unhighlightPlanet(event.keyCode);
                break;
            case 116:
                break;
        }
        this.lastKeyCode = 0;
    }

    highlightPlanet(id){
        let target = this.matchTarget(id-48);
        this.highlightTarget(target);
        this.highlightOrbit(target);
    }

    highlightTarget(target) {
        let distanceTo = this.scene.camera.position.distanceTo(target.threeObject.position);
        let highlightDiameter = distanceTo * 0.011;

        target.highlight = highlightDiameter;
        target.highlight.material.opacity = 0.9;
    }

    highlightOrbit(target) {
        target.orbitLine.orbit.material.color = new THREE.Color(ORBIT_COLOR_HIGHLIGHT); // new THREE.Color('#d3d3d3');
        target.orbitLine.orbit.material.needsUpdate = true;
    }

    unhighlightPlanet(id){
        let target = this.matchTarget(id-48);
        this.unhighlightTarget(target);
        this.unhighlightOrbit(target);
    }

    unhighlightTarget(target) {
        target.core.remove(target.highlight);
    }

    unhighlightOrbit(target) {
        target.orbitLine.orbit.material.color = new THREE.Color(ORBIT_COLOR_DEFAULT);
        target.orbitLine.orbit.material.needsUpdate = true;
    }

    matchTarget(id) {
        for(let i = 0; i < this.sceneObjects.planets.length; i++) {
            if(this.sceneObjects.planets[i].id == id) {
                return this.sceneObjects.planets[i];
            }
        }
    }
}

export default KeyboardController;