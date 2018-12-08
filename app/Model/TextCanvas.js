
function TextCanvas(params){
	//text for object name
	this.text = params.name
	var height = 1, //height kebelakang
		size = 4,
		hover = 85, //makin besar, makin kebawah
		curveSegments = 4,
		bevelThickness = 0.07,
		bevelSize = 0.27, //tumpukan makin besar
		bevelSegments = 7, // makin halus
		bevelEnabled = true,
		font = undefined;
		// fontName = "helvetiker",
		// fontWeight = "bold";

	// var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
	// pointLight.position.set( 0, 100, 90 );
	// this.scene.add( pointLight );

	function decimalToHex( d ) {
		var hex = Number( d ).toString( 16 );
		hex = "000000".substr( 0, 6 - hex.length ) + hex;
		return hex.toUpperCase();
	}

	var hex, materials, textGeo, textMesh1, textMesh2;
	var mirror = true;

	function createText(){
	textGeo = new THREE.TextGeometry( this.text, {
		font: font,
		size: size,
		height: height,
		curveSegments: curveSegments,
		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled
	} );
	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();
	
	if ( ! bevelEnabled ) {
		var triangleAreaHeuristics = 0.1 * ( height * size );
		for ( var i = 0; i < textGeo.faces.length; i ++ ) {
			var face = textGeo.faces[ i ];
			if ( face.materialIndex == 1 ) {
				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
					face.vertexNormals[ j ].z = 0;
					face.vertexNormals[ j ].normalize();
				}
				var va = textGeo.vertices[ face.a ];
				var vb = textGeo.vertices[ face.b ];
				var vc = textGeo.vertices[ face.c ];
				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
				if ( s > triangleAreaHeuristics ) {
					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
						face.vertexNormals[ j ].copy( face.normal );
					}
				}
			}
		}
	}
	var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
	textMesh1 = new THREE.Mesh( textGeo, materials );
	textMesh1.position.x = centerOffset;
	textMesh1.position.y = hover;
	textMesh1.position.z = 0;
	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;
	this.group.add( textMesh1 );
	if ( mirror ) {
		textMesh2 = new THREE.Mesh( textGeo, materials );
		textMesh2.position.x = centerOffset;
		textMesh2.position.y = - hover;
		textMesh2.position.z = -55;
		textMesh2.rotation.x = THREE.Math.degToRad(180);
		textMesh2.rotateX(THREE.Math.degToRad(180));
		textMesh2.rotation.y = Math.PI * 2;
		// THREE.Math.degToRad()
		this.group.add( textMesh2 );
	}
	console.log("text created !");
	console.log(textGeo);
	// textGeo.position.z = -100;
	// console.log("after z updated");
	}
	function loadFont() {
		var loader = new THREE.FontLoader();
		loader.load( '../assets/font/helvetiker_bold.typeface.json', function ( response ) {
			font = response;
			createText();
		} );
	}

	var hash = document.location.hash.substr( 1 );
	if ( hash.length !== 0 ) {
		var colorhash = hash.substring( 0, 6 );
		var fonthash = hash.substring( 6, 7 );
		var weighthash = hash.substring( 7, 8 );
		var bevelhash = hash.substring( 8, 9 );
		var texthash = hash.substring( 10 );
		hex = colorhash;
		pointLight.color.setHex( parseInt( colorhash, 16 ) );
		// fontName = reverseFontMap[ parseInt( fonthash ) ];
		// fontWeight = reverseWeightMap[ parseInt( weighthash ) ];
		bevelEnabled = parseInt( bevelhash );
		text = decodeURI( texthash );
		// updatePermalink();
	} else {
		pointLight.color.setHSL( Math.random(), 1, 0.5 );
		hex = decimalToHex( pointLight.color.getHex() );
	}
	materials = [
		new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
	];
	this.group = new THREE.this.group();
	this.group.position.y = 100;
	// this.scene.camera.add( this.group );

	loadFont();
	// var loader = new THREE.FontLoader();
	// loader.laod('../assets/font/helvetiker_bold.typeface.json', function(font){
	//     var geom = new THREE.TextGeometry('planet Merkurius', {
	//         font: font,
	//         size: 80,
	//         height: 5,
	//         curveSegments: 12,
	//         bevelEnabled: true,
	//         bevelThickness: 10,
	//         bevelSize: 8,
	//         bevelSegments: 5
	//     });
	// });
	console.log("after text created");

	// infografis


	function makeTextSprite( message, parameters )
	{
		if ( parameters === undefined ) parameters = {};
		
		var fontface = parameters.hasOwnProperty("fontface") ? 
			parameters["fontface"] : "Arial";
		
		var fontsize = parameters.hasOwnProperty("fontsize") ? 
			parameters["fontsize"] : 18;
		
		var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
			parameters["borderThickness"] : 4;
		
		var borderColor = parameters.hasOwnProperty("borderColor") ?
			parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
		
		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
			parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
		// var spriteAlignment = THREE.SpriteAlignment.topLeft;
			
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;
	    
		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;
		
		// background color
		context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
									  + backgroundColor.b + "," + backgroundColor.a + ")";
		// border color
		context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
									  + borderColor.b + "," + borderColor.a + ")";
		context.lineWidth = borderThickness;
		roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
		// 1.4 is extra height factor for text below baseline: g,j,p,q.
		
		// text color
		context.fillStyle = "rgba(0, 0, 0, 1.0)";
		context.fillText( message, borderThickness, fontsize + borderThickness);

		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;
		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture, color: 0xffffff } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(100,50,1.0);
		return sprite;	
	}
	// function for drawing rounded rectangles
	function roundRect(ctx, x, y, w, h, r) 
	{
	    ctx.beginPath();
	    ctx.moveTo(x+r, y);
	    ctx.lineTo(x+w-r, y);
	    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
	    ctx.lineTo(x+w, y+h-r);
	    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
	    ctx.lineTo(x+r, y+h);
	    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
	    ctx.lineTo(x, y+r);
	    ctx.quadraticCurveTo(x, y, x+r, y);
	    ctx.closePath();
	    ctx.fill();
		ctx.stroke();   
	}

	this.spritey = makeTextSprite( " World! ", 
		{ fontsize: 100, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	this.spritey.position.set(0,0,0);
	console.log("text sprite created");
	//this.scene.camera.add(this.spritey);

	// var sprite = new SpriteText2D("SPRITE", { align: textAlign.center,  font: '40px Arial', fillStyle: '#000000' , antialias: false })
	// this.scene.add(sprite)

	// var SpriteText2D = THREE_Text.SpriteText2D;
	// this.sprite = new SpriteText2D("SPRITE", { align: textAlign.center, font: '30px Arial', fillStyle: '#000000'})
	// this.sprite.position.set(0, -200, 0)
	// this.sprite.scale.set(1.5, 1.5, 1.5)
	// this.sprite.material.alphaTest = 0.1
	// this.scene.add(this.sprite)
}

export default TextCanvas;