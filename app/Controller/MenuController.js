import TextCanvas from "../Model/TextCanvas";

class MenuController {
    constructor(options){
        this._scene = options.scene;
        this._camera = options.scene.camera;

        this._raycaster = new THREE.Raycaster();
        this._raycaster.setFromCamera( { x: 0, y: 0 }, this._camera );

        this.textCanvas = null;
    }

    get scene() {
        return this._scene;
    }

    get camera() {
        return this._camera;
    }

    initializeUserInferface(){
        this.textCanvas = new TextCanvas({
            name : 'Welcome'
        })
        this.scene.add(this.textCanvas.group);
        this.scene.add(this.textCanvas.spritey);
    }

    updateUserInterface() {

    }
}

export default MenuController;