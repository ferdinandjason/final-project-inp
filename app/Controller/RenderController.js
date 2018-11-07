'use strict'

import * as THREE from 'three';;

class RenderController {
    constructor(scene) {
        this._renderEngine = new THREE.WebGLRenderer();
        this._scene = scene;
        this._camera = scene.camera;

        this.setFrame();
        
        this.render = this.render.bind(this);

        this.render();

        this.frameEvent = new CustomEvent('frame');
    }

    render() {
        requestAnimationFrame(this.render);
        
        document.dispatchEvent(new CustomEvent('frame'));
        this._renderEngine.render(this._scene, this._camera);
    }

    setFrame() {
        let framecontainer = document.getElementById('solar-system');
        this._renderEngine.setSize(window.innerWidth, window.innerHeight);

        if (framecontainer) {
            framecontainer.appendChild(this._renderEngine.domElement);
        } else {
            document.body.appendChild(this._renderEngine.domElement);
        }
    }
}

export default RenderController;