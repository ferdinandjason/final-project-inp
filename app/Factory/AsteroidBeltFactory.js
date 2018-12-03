'use strict'

import Constants from '../Utils/Constants';

class AsteroidBeltFactory {
    constructor(scene, data) {
        this._scene = scene || null;
        this._count = data.asteroidBelt.count || 1000;
        this._distanceFromParent = data.asteroidBelt.distanceFromParent.min;
        this._distanceFromParentMin = data.asteroidBelt.distanceFromParent.min;
        this._distanceFromParentMax = data.asteroidBelt.distanceFromParent.max;
        this._distanceFromParentMedian = this.calculateDistanceFromParentMedian();
        this._texture = new THREE.TextureLoader().load('assets/textures/asteroid.jpg');
        this._orbitCentroid = new THREE.Group();
        this._orbitRadian = 360 / 1681.6;
    }

    build() {
        return new Promise((resolve, reject) => {
            let particles = this._count;
            let geometry = new THREE.BufferGeometry();
            let positions = new Float32Array(particles * 3);
            let colors = new Float32Array(particles * 3);
            let color = new THREE.Color();
            let n = 1000;
            let n2 = n / 2; // particles spread in the cube

            let material = new THREE.PointsMaterial({
                size: 16,
                map: this._texture
            });

            for (let i = 0; i < positions.length; i += 3) {
                let pos = this.positionAsteroid(i);
                let x = pos.x;
                let y = pos.y;
                let z = pos.z;

                positions[i] = x;
                positions[i + 1] = y;
                positions[i + 2] = z;

                color.setRGB(119, 81, 20);

                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }

            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.computeBoundingSphere();

            let particleSystem = new THREE.Points(geometry, material);

            this._orbitCentroid.add(particleSystem);

            this._scene.add(this._orbitCentroid);

            document.addEventListener('frame', (e)=> {
                this._orbitCentroid.rotation.z += THREE.Math.degToRad(0.002);
            }, false);

            resolve();
        });
    }

    positionAsteroid(count) {
        let odd = count % 2;
        let oddd = count % 3;
        let d = this._distanceFromParentMin * Constants.ORBIT_SCALE;

        if(odd) d = this._distanceFromParentMedian * Constants.ORBIT_SCALE;
        if(oddd) d = this._distanceFromParentMax * Constants.ORBIT_SCALE;

        d += (count / count.toFixed(0).length);

        let randomNumber = Math.floor(Math.random() * 2000) * (Math.random() + 1);
        let randomOffest = odd ? randomNumber * -1 : randomNumber;

        let amplitude = d + randomOffest * (2 + Math.random());
        let theta = count + THREE.Math.degToRad(1 * Math.random() * this._orbitRadian);

        let posX = amplitude * Math.cos(theta);
        let posY = amplitude * Math.sin(theta);
        let posZ = (Math.random() * 1400) -700;

        return {
            x: posX,
            y: posY,
            z: odd ? posZ * -1 : posZ
        }
    }

    calculateDistanceFromParentMedian() {
        return Number.parseFloat((this._distanceFromParentMin + this._distanceFromParentMax) / 2);
    }
}

export default AsteroidBeltFactory;