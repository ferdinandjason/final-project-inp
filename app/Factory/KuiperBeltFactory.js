'use strict'

import * as THREE from 'three';
import Constants from '../Utils/Constants';

class KuiperBeltFactory {
    constructor(scene, data) {
        this._scene = scene || null;
        this._count = data.kuiperBelt.count || 1000;
        this._distanceFromParentMin = data.kuiperBelt.distanceFromParent.min;
        this._distanceFromParentMax = data.kuiperBelt.distanceFromParent.max;
        this._distanceFromParentMedian = this.calculateDistanceFromParentMedian();
        this._texture = new THREE.TextureLoader().load('assets/textures/asteroid_dark.jpg');
        this._orbitCentroid = new THREE.Object3D();
        this._orbitRadian = 360 / 112897;
    }

    build() {
        return new Promise((resolve, reject) => {
            let particles = this._count;
            let geometry = new THREE.BufferGeometry();
            let positions = new Float32Array(particles * 3);
            let colors = new Float32Array(particles * 3);
            let n = 1000;

            let material = new THREE.PointsMaterial({
                size: 1,
                map: this._texture
            });

            for (let i = 0; i < positions.length; i += 3) {
                this._orbitCentroid.rotation.z += Math.random() + 1;

                let pos = this.positionObject(i);
                let x = pos.x;
                let y = pos.y;
                let z = pos.z;

                positions[i] = x;
                positions[i + 1] = y;
                positions[i + 2] = z;
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

            console.log('kuiperr');

            resolve();
        });
    }

    positionObject(count) {
        let odd = count % 2;
        let d = this._distanceFromParentMin * Constants.ORBIT_SCALE;

        d += (count / count.toFixed(0).length);

        let randomNumber = Math.floor(Math.random() * 80000) * (Math.random() + 1);
        let randomOffset = odd ? randomNumber * (Math.random() + 0.2) : randomNumber * (Math.random() + 0.05);

        let amplitude = d + randomOffset * (3 + Math.random());
        let theta = count + THREE.Math.degToRad(1 * Math.random() * this._orbitRadian)

        let posX = amplitude * Math.cos(theta);
        let posY = amplitude * Math.sin(theta);
        let posZ = (Math.random() * 14000) + -7000;

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

export default KuiperBeltFactory;