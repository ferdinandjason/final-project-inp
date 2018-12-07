import Moon from '../Model/Moon';

class TravelController {
    constructor(scene) {
        this.scene = scene;
        this.camera = this.scene.cameraWrapper;
    }

    calculateDestinationCoordinates(targetObject){
        var target = new THREE.Vector3().setFromMatrixPosition(targetObject.threeObject.matrixWorld)

        var x = target.x;
        var y = target.y;
        var z = target.z;

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

        let destination = new THREE.Vector3();
        destination.x = destinationX;
        destination.y = destinationY;// - (target.threeDiameter);
        destination.z = destinationZ + (target.threeDiameter * 0.15);

        return destination;
    }

    prepareForTravel(takeOffHeight, targetObject) {
        var travelDuration = 3000;
  
        return new TWEEN.Tween(this.camera.position)
          .to({
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z + takeOffHeight + 700
          }, travelDuration)
          .easing(TWEEN.Easing.Cubic.InOut)
          .onUpdate((currentAnimationPosition)=> {
                this.camera.lookAt(targetObject.threeObject.position);
          })
        ;
      }

    travelToPlanet(targetObject, takeOffHeight) {
        let travelDuration = 5000;

        THREE.SceneUtils.detach(this.camera, this.camera.parent, this.scene);
        THREE.SceneUtils.attach(this.camera, this.scene, targetObject.orbitCentroid);
        
        targetObject.core.updateMatrixWorld();
        targetObject.orbitCentroid.updateMatrixWorld();
    
        this.camera.lookAt(targetObject.threeObject.position);

        let destinationCoordinates  = this.calculateDestinationCoordinates(targetObject);
        let takeOff = this.prepareForTravel(takeOffHeight, targetObject);

        let cameraTarget = targetObject instanceof Moon? targetObject.core : targetObject.objectCentroid;
        
        return takeOff.start().onComplete(()=> {
            var cameraTween = new TWEEN.Tween(this.camera.position)
                .to(destinationCoordinates, travelDuration)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function(currentAnimationPosition){
                    cameraTween.to(destinationCoordinates);

                    this.camera.lookAt(targetObject.threeObject.position);

                    if (targetObject.highlight.geometry.boundingSphere.radius > targetObject.threeDiameter / 1.25) {
                        this.updateTargetHighlight(targetObject);
                    }
                }.bind(this))
                .onComplete(this.handleComplete.bind(this, targetObject, cameraTarget))
                .start();  
        });

        //window.solarSystemFactory.scene.cameraWrapper.rotation.x = THREE.Math.degToRad(-90);
    }

    handleComplete(targetObject, cameraTarget){
        cameraTarget = cameraTarget || targetObject.objectCentroid;

        THREE.SceneUtils.detach(this.camera, this.camera.parent, this.scene);
        THREE.SceneUtils.attach(this.camera, this.scene, cameraTarget);

        this.camera.lookAt(new THREE.Vector3());

        targetObject.core.updateMatrixWorld();
        targetObject.orbitCentroid.updateMatrixWorld();
    }

    updateTargetHighlight(target) {
        if(target.highlight) target.core.remove(target.highlight);
  
        var distanceTo = this.camera.position.distanceTo(target.threeObject.position);
        var highlightDiameter = distanceTo * 0.011; // 1.1% of distance to target
  
        target.highlight = highlightDiameter;
        target.highlight.material.opacity = 0.9;
    }
}

export default TravelController;
