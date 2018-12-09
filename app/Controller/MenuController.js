import TextGeometry from "../Model/TextGeometry";

class MenuController {
    constructor(options){
        this._scene = options.scene;
        this._camera = options.scene.camera;

        this._raycaster = new THREE.Raycaster();

        this._textGeo = new TextGeometry({
            name : 'Solar-System'
        });

        this.intersect = null;
    }

    get scene() {
        return this._scene;
    }

    get camera() {
        return this._camera;
    }

    get textGeo() {
        return this._textGeo;
    }

    initUserInterface() {
        this._camera.add(this.textGeo.group);
    }

    updateUserInterface() {
        this._raycaster.setFromCamera( { x: 0, y: 0 }, this._camera );
        this.intersect = this._raycaster.intersectObjects(this._scene.children, true);
        console.log(this.intersect);
        if(this.intersect.length && this._textGeo.text != this.intersect[0].object.name){
            //console.log(this.intersect[0].object.name);
            this._textGeo.text = this.intersect[0].object.name
            while(this._textGeo.group.children.length){
                this._textGeo.group.remove(this._textGeo.group.children[0]);
            }
            this._textGeo.createText();
        }
    }
}

export default MenuController;