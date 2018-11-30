'use strict'

import * as THREE from 'three';
import SceneUtils from '../Utils/Scene';

const ORBIT_COLOR_DEFAULT = '#424242';
const ORBIT_COLOR_HIGHLIGHT = '#197eaa';
const ORBIT_COLOR_ACTIVE = '#3beaf7';

class KeyboardController {
    constructor(options){
        this.scene = options.scene || null;
        this.camera = options.scene.camera;
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

    calculateDestinationCoordinates(planetWorldPosition, target){
        var x = planetWorldPosition.x;
        var y = planetWorldPosition.y;
        var z = planetWorldPosition.z;

        var destinationX = x;
        var destinationY = y;
        var destinationZ = z;

        var quadrant1 = x > 0 && y > 0;
        var quadrant2 = x < 0 && y > 0;
        var quadrant3 = x < 0 && y < 0;
        var quadrant4 = x > 0 && y < 0;

        var offset = target.threeDiameter > 3 ? target.threeDiameter * 3 : target.threeDiameter * 3;

        if (quadrant1) {
            destinationX = destinationX + offset;
            destinationY = destinationY + offset;
        }

        if (quadrant2) {
            destinationX = destinationX - offset;
            destinationY = destinationY + offset;
        }

        if (quadrant3) {
            destinationX = destinationX - offset;
            destinationY = destinationY - offset;
        }

        if (quadrant4) {
            destinationX = destinationX + offset;
            destinationY = destinationY - offset;
        }

        return {
            x: destinationX,
            y: destinationY,
            z: destinationZ + (target.threeDiameter * 0.15)
        }
    }

    travel(id){
        this.scene.updateMatrixWorld();
        let target = this.matchTarget(id-48);
        
        let planetWorldPosition = new THREE.Vector3();
        planetWorldPosition.setFromMatrixPosition( target.threeObject.matrixWorld );

        let destination = this.calculateDestinationCoordinates(planetWorldPosition, target);

        // SceneUtils.detach(this.camera, this.camera.parent, this.scene);
        // SceneUtils.attach(this.camera, this.scene, target.orbitCentroid);

        // target.core.updateMatrixWorld();
        // target.orbitCentroid.updateMatrixWorld();

        this.camera.position.x = destination.x;
        this.camera.position.y = destination.y;
        this.camera.position.z = destination.z;
        this.camera.lookAt(planetWorldPosition);
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