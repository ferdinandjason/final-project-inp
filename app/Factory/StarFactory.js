'use strict'

import * as THREE from 'three';
import Constants from '../Utils/Constants';

function getRandomPointInSphere(radius, x0, y0, z0) {
    if (!x0) { x0 = 0 }
    if (!y0) { y0 = 0 }
    if (!z0) { z0 = 0 }

    let u = Math.random();
    let v = Math.random();
    let theta = 2 * Math.PI * u;
    let phi = Math.acos(1 - 2 * v);
    let x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
    let y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
    let z = z0 + (radius * Math.cos(phi));

    return new THREE.Vector3(x, y, z);
}

class StarFactory {
    constructor(scene) {
        this._starsCentriod = new THREE.Group();
        this._starsCount = 8000;
        this._threeDistanceFromParent = 14959787070 * 40000 * Constants.ORBIT_SCALE;
        this._texture = new THREE.TextureLoader().load('assets/textures/star.jpg');
        this._scene = scene;

        this.getStarData();
    }

    getStarData() {
      // let request = new AjaxRequest('GET', 'http://star-api.herokuapp.com/api/v1/stars');

      // request.send().then((data)=> {
      //   console.debug('Star Data:', data);
      // });
    }

    getPosition(i) {
        let x = 0;
        let y = 0;
        let z = 0;

        return getRandomPointInSphere(this._threeDistanceFromParent, x, y, z);
    }

    buildStarField() {
        return new Promise((resolve)=> {
            let particles = this._starsCount;
            let geometry = new THREE.BufferGeometry();
            let positions = new Float32Array(particles * 3);
            let colors = new Float32Array(particles * 3);
            let color = new THREE.Color();
            let n = 1000;
            let n2 = n / 2; // particles spread in the cube

            for (let i = 0; i < positions.length; i += 3) {
                let pos = this.getPosition(i);
                let x = pos.x;
                let y = pos.y;
                let z = pos.z;

                positions[i] = x;
                positions[i + 1] = y;
                positions[i + 2] = z;

                color.setRGB(255, 255, 255);

                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }

            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.computeBoundingSphere();

            let material = new THREE.PointsMaterial({
                size: 5,
                map: this._texture
            });

            let stars = new THREE.Points(geometry, material);

            this._scene.add(stars);

            resolve();
        });
    }
  }


export default StarFactory;