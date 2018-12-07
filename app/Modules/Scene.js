'use strict'

import OrbitControls from '../Utils/OrbitControls';


const AMBIENT_LIGHT_COUNTS = 4;
const DIRECTIONAL_LIGHT_COLOR = '0xFFFFFF';
const DIRECTIONAL_LIGHT_INTENSITY = 0.175;

class Scene extends THREE.Scene {
    constructor(){
        super();

        this._sceneElement = document.getElementById('solar-system')
        this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.05, 5 * Math.pow(10, 13));
        //this._cameraWrapper = new THREE.Group();
        //this._cameraWrapper.add(this._camera);
        this._cameraWrapper = this.camera;

        this.setLights();
        this.setAxis();
    }

    get camera() {
        return this._camera;
    }

    get orbitControls() {
        return this._orbitControls
    }

    get cameraWrapper() {
        return this._cameraWrapper
    }

    get sceneElement() {
        return this._sceneElement   
    }

    setAxis() {
        this.rotation.x = THREE.Math.degToRad(90);
    }


    setLights() {
        for(let i = 0; i < AMBIENT_LIGHT_COUNTS; i++) {
            let directionalLight = new THREE.DirectionalLight(DIRECTIONAL_LIGHT_COLOR, DIRECTIONAL_LIGHT_INTENSITY);

            this.setObjectPosition(directionalLight, i)
            super.add(directionalLight);
        }
    }

    setObjectPosition(object, index) {
        switch(index) {
            case 0:
                object.position.set(0, 0, 10000);
                break;
            case 1:
                object.position.set(0, 0, -10000);
                break;
            case 2:
                object.position.set(10000, 0, 0);
                break;
            case 3:
                object.position.set(-10000, 0, 0);
                break;
        }
    }
}

export default Scene;
