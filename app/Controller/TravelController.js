import Moon from '../Model/Moon';

class TravelController {
    constructor(scene) {
        this.scene = scene;
        this.camera = this.scene.cameraWrapper;
        this.travelStartEvent = new CustomEvent('travel.start');
    }

    calculateDestinationCoordinates_(radius, theta, distanceFromParent) {
        // var d = distanceFromParent + (distanceFromParent / 2);
        var r = radius;
        var x = r * Math.cos(theta);
        var y = r * Math.sin(theta);
  
        return {
          x: x,
          y: y,
          z: 0
        };
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
            destinationX = destinationX - offset;
            destinationY = destinationY - offset;
        }

        if (quadrant2) {
            destinationX = destinationX + offset;
            destinationY = destinationY - offset;
        }

        if (quadrant3) {
            destinationX = destinationX + offset;
            destinationY = destinationY + offset;
        }

        if (quadrant4) {
            destinationX = destinationX - offset;
            destinationY = destinationY + offset;
        }

        let destination = new THREE.Vector3();
        destination.x = destinationX;
        destination.y = destinationY;
        destination.z = destinationZ + (target.threeDiameter * 0.15);

        return destination;
    }

    prepareForTravel(takeOffHeight, targetObject) {
        var travelDuration = 3000;
        console.log('qweqweqweqweqwe', THREE.Math.radToDeg(this.camera.rotation.x), THREE.Math.radToDeg(this.camera.rotation.y), THREE.Math.radToDeg(this.camera.rotation.z));
        console.log(this.camera.uuid);
  
        return new TWEEN.Tween(this.camera.position)
          .to({
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z + takeOffHeight + 700
          }, travelDuration)
          .easing(TWEEN.Easing.Cubic.InOut)
          .onUpdate((currentAnimationPosition)=> {

          })
        ;
      }

    travelToPlanet(targetObject, takeOffHeight) {
        let travelDuration = 5000;

        //this.scene.updateMatrixWorld();
        console.log(this.camera.rotation);
        console.log(this.camera.uuid);

        let planetWorldPosition = new THREE.Vector3();
        
        planetWorldPosition.setFromMatrixPosition( targetObject.threeObject.matrixWorld );

        this.camera.up = new THREE.Vector3(-1, 0, 0);
        this.camera.lookAt(planetWorldPosition);

        let destinationCoordinates  = this.calculateDestinationCoordinates(planetWorldPosition, targetObject);
        let takeOff = this.prepareForTravel(takeOffHeight, targetObject);

        let cameraTarget = targetObject instanceof Moon? targetObject.core : targetObject.objectCentroid;

        let deviationInX = this.camera.rotation.x

        return takeOff.start().onComplete(()=> {
            var cameraTween = new TWEEN.Tween(this.camera.position)
                .to(destinationCoordinates, travelDuration)
                .easing(TWEEN.Easing.Sinusoidal.In)
                .onUpdate(function(currentAnimationPosition){
                    console.log('asdasdasdasdasd', THREE.Math.radToDeg(this.camera.rotation.x), THREE.Math.radToDeg(this.camera.rotation.y), THREE.Math.radToDeg(this.camera.rotation.z));
                    console.log(this.camera.uuid);

                    //cameraTween.to(destinationCoordinates);

                    this.camera.lookAt(planetWorldPosition);
                    
                    
                    console.log(deviationInX,this.camera.rotation.x)
                    this.camera.rotation.x += (deviationInX - this.camera.rotation.x);
                    deviationInX = this.camera.rotation.x

                    this.camera.updateMatrixWorld();

                    // if (targetObject.highlight.geometry.boundingSphere.radius > targetObject.threeDiameter / 2.25) {
                    //     this.updateTargetHighlight(targetObject);
                    // }
                }.bind(this))
                .onComplete(this.handleComplete.bind(this, targetObject, cameraTarget, deviationInX))
                .start();  
                
        });
    }

    handleComplete(targetObject, cameraTarget, deviationInX){
        cameraTarget = cameraTarget || targetObject.objectCentroid;
        let planetWorldPosition = new THREE.Vector3();
        planetWorldPosition.setFromMatrixPosition( targetObject.threeObject.matrixWorld );
        
        
        this.camera.lookAt(planetWorldPosition);
        this.camera.rotation.x += THREE.Math.degToRad(-105)
        this.camera.updateMatrixWorld();
        console.log(this.scene);

        console.log(this.camera.position);
        console.log(this.scene);
        console.log(new THREE.Vector3().setFromMatrixPosition(this.camera.matrixWorld));
        console.log(this.camera);
        
    }

    updateTargetHighlight(target) {
        target.core.remove(target.highlight);
  
        var distanceTo = this.camera.position.distanceTo(target.threeObject.position);
        var highlightDiameter = distanceTo * 0.011; // 1.1% of distance to target
  
        target.highlight = highlightDiameter;
        target.highlight.material.opacity = 0.9;
    }
}

export default TravelController;
