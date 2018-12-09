import TextGeometry from "../Model/TextGeometry";

class MenuController {
    constructor(options){
        this._scene = options.scene;
        this._camera = options.scene.camera;
        this._threeObject = options.objectThree

        this._raycaster = new THREE.Raycaster();
        this._raycaster.far = 10;

        this._textGeo = new TextGeometry({
            name : ' '
        });

        this.textureMap = {
            '1' : new THREE.TextureLoader().load('../../assets/infografis/1.png'),
            '2' : new THREE.TextureLoader().load('../../assets/infografis/2.png'),
            '3' : new THREE.TextureLoader().load('../../assets/infografis/3.png'),
            '3a' : new THREE.TextureLoader().load('../../assets/infografis/3a.png'),
            '4' : new THREE.TextureLoader().load('../../assets/infografis/4.png'),
            '5' : new THREE.TextureLoader().load('../../assets/infografis/5.png'),
            '5a' : new THREE.TextureLoader().load('../../assets/infografis/5a.png'),
            '5b' : new THREE.TextureLoader().load('../../assets/infografis/5b.png'),
            '5c' : new THREE.TextureLoader().load('../../assets/infografis/5c.png'),
            '6' : new THREE.TextureLoader().load('../../assets/infografis/6.png'),
            '6g' : new THREE.TextureLoader().load('../../assets/infografis/6g.png'),
            '6j' : new THREE.TextureLoader().load('../../assets/infografis/6j.png'),
            '6k' : new THREE.TextureLoader().load('../../assets/infografis/6k.png'),
            '6l' : new THREE.TextureLoader().load('../../assets/infografis/6l.png'),
            '6n' : new THREE.TextureLoader().load('../../assets/infografis/6n.png'),
            '7' : new THREE.TextureLoader().load('../../assets/infografis/7.png'),
            '8' : new THREE.TextureLoader().load('../../assets/infografis/8.png'),
            '9' : new THREE.TextureLoader().load('../../assets/infografis/9.png')
        }

        this._infografis = new THREE.Mesh(
            new THREE.PlaneGeometry(15, 20),
            new THREE.MeshBasicMaterial({
                map : this.textureMap['0'],
            })
        );
        this._infografis.position.set(-15, 0, -25);
        this._infografis.visible = false;

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
        this._camera.add(this._infografis);
    }

    updateUserInterface() {
        this._raycaster.setFromCamera( { x: 0, y: 0 }, this._camera );
        this.intersect = this._raycaster.intersectObjects(this._threeObject);
        if(this.intersect.length && this._textGeo.text != this.intersect[0].object.name){
            this._textGeo.text = this.intersect[0].object.name
            while(this._textGeo.group.children.length){
                this._textGeo.group.remove(this._textGeo.group.children[0]);
            }
            this._textGeo.createText();
            this._infografis.material.map = this.textureMap[this.intersect[0].object.idPlanet];
            console.log(this.intersect[0].object);
            this._infografis.material.needsUpdate = true;
            this._infografis.visible = true;
            if(!this._infografis.material.map) this._infografis.visible = false;
        } else if(!this.intersect.length && this._textGeo.text != ' ') {
            this._textGeo.text = ' '
            while(this._textGeo.group.children.length){
                this._textGeo.group.remove(this._textGeo.group.children[0]);
            }
            this._textGeo.createText();
            this._infografis.material.map = null;
            this._infografis.material.needsUpdate = true;
            this._infografis.visible = false;
        } else if(!this.intersect.length && this._textGeo.text === ' '){
            
        }
    }
}

export default MenuController;