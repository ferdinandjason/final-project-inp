'use strict'

import * as THREE from 'three';

import CelestialObject from './CelestialObject';
import Orbit from './Orbit';

import Constants from '../Utils/Constants';

const MOON_ORBIT_COLOR = '#424242';
const MOON_HIGHLIGHT_COLOR = '#3beaf7';

class Moon extends CelestialObject {
    constructor(data, threeParent, parentData, orbitColor) {
        super(data.diameter, data.mass, data.gravity, data.density);

        this._id = data.id || null;
        this._name = data.name || null;
        this._distanceFromParent = data.distanceFromParent || null;
        this._orbitalPeriod = Number.parseFloat(data.orbitalPeriod) || null;
        this._orbitalInclination = data.orbitalInclination || null; // to the equatorial plane of the parent object
        this._mass = data.mass || null;
        this._orbitColor = orbitColor || MOON_ORBIT_COLOR;

        // THREE properties
        this._threeDiameter = this.createThreeDiameter();
        this._threeRadius = this.createThreeRadius();
        this._surface = this.createSurface(data._3d.textures.base, data._3d.textures.topo);
        this._threeObject = this.createGeometry(this._surface);
        this._threeDistanceFromParent = this.createThreeDistanceFromParent();
        this._threeParent = threeParent || null;   

        this._parentData = parentData || null;
        this._orbitCentroid = new THREE.Group();
        this._highlight = this.createHighlight();

        this.buildFullObject3D();
    }

    /**
     * Moon Data
     */

    get id() {
        return this._id;
    }
  
    get name() {
        return this._name;
    }
  
    get distanceFromParent() {
        return this._distanceFromParent;
    }
  
    get orbitalPeriod() {
        return this._orbitalPeriod;
    }
  
    get orbitalInclination() {
        return this._orbitalInclination;
    }
  
    get mass() {
        return this._mass;
    }

    /**
     * 3D Model Data
     */

    get threeDiameter() {
        return this._threeDiameter;
    }

    get threeRadius() {
        return this._threeRadius;
    }

    get threeObject() {
        return this._threeObject;
    }

    get threeParent() {
        return this._threeParent;
    }

    get threeDistanceFromParent() {
        return this._threeDistanceFromParent;
    }

    get orbitLine() {
        return this._orbitLine;
    }

    get orbitCentroid() {
        return this._orbitCentroid;
    }

    get orbitColor() {
        return this._orbitColor;
    }

    get orbitColorDefault() {
        return this._orbitColorDefault;
    }

    get parentData() {
        return this._parentData;
    }

    get highlight() {
        return this._highlight;
    }

    set highlight(amplitude) {
        this._highlight = this.createHighlight(amplitude);
    }

    createHighlight(amplitude) {
        let resolution = 2880; // segments in the line
        let length = 360 / resolution;
        let highlightDiameter = this._threeDiameter > 4 ? this._threeDiameter * 45 : this._threeDiameter * 75;
        let orbitAmplitude = amplitude || highlightDiameter;
        let orbitLine = new THREE.Geometry();
        let material = new THREE.MeshBasicMaterial({
            color: MOON_HIGHLIGHT_COLOR,
            transparent: true,
            opacity: 0,
            depthTest: false
        });

        for (let i = 0; i <= resolution; i++) {
            let segment = (i * length) * Math.PI / 180;

            orbitLine.vertices.push(
                new THREE.Vector3(
                    Math.cos(segment) * orbitAmplitude,
                    Math.sin(segment) * orbitAmplitude,
                    0
                )
            );
        }

        let line = new THREE.Line(orbitLine, material);

        line.rotation.y += THREE.Math.degToRad(90);
        line.position.set(0, 0, 0);

        this._core.add(line);

        return line;
    }

    buildFullObject3D() {
        this._orbitLine = new Orbit(this, MOON_ORBIT_COLOR);

        this._orbitCentroid.add(
            this._threeObject,
            this._core,
            this._orbitLine.orbit
        );
    }

    createThreeDiameter() {
        if (this._diameter < 300) {
            return this._diameter * 0.0007;
        }
        return this._diameter * Constants.CELESTIAL_SCALE;
    }

    createThreeRadius() {
        if (this._diameter < 300) {
            return this._diameter * 0.0007 / 2;
        }
        return (this._diameter * Constants.CELESTIAL_SCALE) / 2;
    }

    createThreeDistanceFromParent() {
        return this._distanceFromParent * Constants.ORBIT_SCALE;
    }

    getTexture(src, filter) {
        // this._textureLoader = new THREE.TextureLoader();
        let texture = new THREE.TextureLoader().load(src);

        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        if (filter) {
            texture.filter = filter;
        }

        return texture;
    }

    createGeometry(surface, atmosphere) {
        let segmentsOffset = Number.parseInt(this._threeDiameter + 1 * 35);
        let mesh = new THREE.Mesh(
            new THREE.SphereGeometry(
                this._threeRadius,
                segmentsOffset,
                segmentsOffset
            ),
            surface
        );

        if (atmosphere) {
            mesh.add(atmosphere);
        }

        return mesh;
    }

    createSurface(base, topo, specular) {
        let map = this.getTexture(base), bumpMap;
        map.minFilter = THREE.NearestFilter;

        if (topo) {
          bumpMap = this.getTexture(topo);
          bumpMap.minFilter = THREE.NearestFilter;
        }

        return new THREE.MeshLambertMaterial({
            map: map,
            bumpMap: bumpMap || null,
            bumpScale: bumpMap ? 0.012 : null,
        });
    }
}

export default Moon;