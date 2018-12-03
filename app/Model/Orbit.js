'use strict'

const ORBIT_COLOR = '#404040';

class Orbit {
    constructor(object, color) {
        this._object = object;
        this._color = color || new THREE.Color(ORBIT_COLOR);
        this._orbit = this.createOrbit();

        console.log(this._object.threeParent.threeRadius + this._object.threeDistanceFromParent, this._object.name)
    }

    /**
     * Orbit Data
     */

    get orbit() {
        return this._orbit;
    }

    get color() {
        return this._color;
    }

    set color(color) {
        this._color = color;
    }

    createOrbit() {
        let resolution = this._object.threeDistanceFromParent + 15 * 50;
        let length = 360 / resolution;
        let orbitLine = new THREE.Geometry();
        let material = new THREE.LineBasicMaterial({
            color: this._color,
            linewidth: 1,
            fog : true,
        });

        for (let i = 0; i <= resolution; i++){
            let segment = THREE.Math.degToRad(i * length)
            let orbitAmplitude = this._object.threeParent.threeRadius + this._object.threeDistanceFromParent;

            orbitLine.vertices.push(
                new THREE.Vector3(
                    Math.cos(segment) * orbitAmplitude,
                    Math.sin(segment) * orbitAmplitude,
                    0
                )
            );
            if(this._object.name === "Mercury"){
                console.log(Math.cos(segment)*orbitAmplitude, Math.sin(segment)*orbitAmplitude," ", segment, i)
            }
        }

        let line = new THREE.Line(orbitLine, material);

        line.position.set(0, 0, 0);

        return line;
    }
}

export default Orbit;