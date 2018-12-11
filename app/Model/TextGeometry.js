class TextGeometry{
    constructor(params){
        this.text = params.name;
        this.height = 1;
        this.size = 4;
        this.hover = 85;
        this.curveSegment = 4;
        this.bevelThickness = 0.07;
        this.bevelSize = 0.27;
        this.bevelEnabled = true;
        this.font = null;

        this.materials = null;
        this.textGeo = null;
        this.textMesh1 = null;
        this.textMesh2 = null;
        this.mirror = true;

        this.materials = [
            new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
        ];

       this.group = new THREE.Group();
       this.group.position.y = 100;

       this.loadFont();
    }

    createText(){
        this.textGeo = new THREE.TextGeometry(this.text, {
            font: this.font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelThickness: this.bevelThickness,
            bevelSize: this.bevelSize,
            bevelEnabled: this.bevelEnabled
        })
        this.textGeo.computeBoundingBox();
        this.textGeo.computeVertexNormals();

        if ( ! this.bevelEnabled ) {
            var triangleAreaHeuristics = 0.1 * ( this.height * this.size );
            for ( var i = 0; i < this.textGeo.faces.length; i ++ ) {
                var face = this.textGeo.faces[ i ];
                if ( face.materialIndex == 1 ) {
                    for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                        face.vertexNormals[ j ].z = 0;
                        face.vertexNormals[ j ].normalize();
                    }
                    var va = this.textGeo.vertices[ face.a ];
                    var vb = this.textGeo.vertices[ face.b ];
                    var vc = this.textGeo.vertices[ face.c ];
                    var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
                    if ( s > triangleAreaHeuristics ) {
                        for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                            face.vertexNormals[ j ].copy( face.normal );
                        }
                    }
                }
            }
        }

        var centerOffset = - 0.5 * ( this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x );
        this.textGeo = new THREE.BufferGeometry().fromGeometry( this.textGeo );
        this.textMesh1 = new THREE.Mesh( this.textGeo, this.materials );
        this.textMesh1.position.x = centerOffset;
        this.textMesh1.position.y = this.hover;
        this.textMesh1.position.z = 0;
        this.textMesh1.rotation.x = 0;
        this.textMesh1.rotation.y = Math.PI * 2;
        this.group.add( this.textMesh1 );

        if ( this.mirror ) {
            this.textMesh2 = new THREE.Mesh( this.textGeo, this.materials );
            this.textMesh2.position.x = centerOffset;
            this.textMesh2.position.y = - this.hover;
            this.textMesh2.position.z = -55;
            this.textMesh2.rotation.x = THREE.Math.degToRad(180);
            this.textMesh2.rotateX(THREE.Math.degToRad(180));
            this.textMesh2.rotation.y = Math.PI * 2;
            // THREE.Math.degToRad()
            this.group.add( this.textMesh2 );
        }
    }

    loadFont() {
        this.loader = new THREE.FontLoader();
		this.loader.load( '../../assets/font/helvetiker_bold.typeface.json', function ( response ) {
            console.log(response);
			this.font = response;
			this.createText();
		}.bind(this) );
    }
}

export default TextGeometry;