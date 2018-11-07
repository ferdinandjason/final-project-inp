'use strict'

import * as THREE from 'three';;

import CelestialObject from './CelestialObject';
import Orbit from './Orbit';

import Constants from '../Utils/Constants';
import RadialRingGeometry from '../Utils/RadialRingGeometry';

const ORBIT_HIGHLIGHT_COLOR = "#2d2d2d";
const PLANET_HIGHLIGHT_COLOR = "#ffbd00";

class Planet extends CelestialObject {
    constructor(data, threeParent){
        super(data.diameter, data.mass, data.gravity, data.density);

        this._id = data.id || null;
        this._name = data.name || null;
        this._rotationPeriod = data.rotationPeriod || null;
        this._lengthOfDay = data.lengthOfDay || null;
        this._distanceFromParent = data.distanceFromParent || null;
        this._orbitalPeriod = data.orbitalPeriod || null;
        this._orbitalVelocity = data.orbitalVelocity || null;
        this._orbitalInclination = data.orbitalInclination || null; // to the ecliptic plane
        this._axialTilt = data.axialTilt || null;
        this._meanTemperature = data.meanTemperature || null;
        this._orbitPositionOffset = data.orbitPositionOffset;
        this._orbitHighlightColor = data.orbitHighlightColor || ORBIT_HIGHLIGHT_COLOR;
        this._textureLoader = new THREE.TextureLoader();
        this._threeDiameter = this.createThreeDiameter();
        this._threeRadius = this.createThreeRadius();
        this._surface = this.createSurface(data._3d.textures.base, data._3d.textures.topo, data._3d.textures.specular);
        this._atmosphere = this.createAtmosphere(data._3d.textures.clouds);
        this._threeObject = this.createGeometry(this._surface, this._atmosphere);
        this._threeDistanceFromParent = this.createThreeDistanceFromParent();
        this._threeParent = threeParent || null;
        this._moons = [];
        this._theta = 0;
        this._orbitCentroid = new THREE.Object3D();
        this._highlight = this.createHighlight();

        if (data.rings) {
            this.createRingGeometry(data);
        }

        this.buildFullObject3D();
    }

    /**
     * Planet Data
     */

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get rotationPeriod() {
        return this._rotationPeriod;
    }

    get distanceFromParent() {
        return this._distanceFromParent;
    }

    get orbitalPeriod() {
        return this._orbitalPeriod;
    }

    get orbitalVelocity() {
        return this._orbitalVelocity;
    }

    get orbitalInclination() {
        return this._orbitalInclination;
    }

    get axialTilt() {
        return this._axialTilt;
    }

    get meanTemperature() {
        return this._meanTemperature;
    }

    get moons() {
        return this._moons;
    }

    get orbitPositionOffset() {
        return this._orbitPositionOffset;
    }

    get theta() {
        return this._theta;
    }

    set theta(theta) {
        this._theta = theta;
    }

    get highlight() {
        return this._highlight;
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

    get orbitCentroid() {
        return this._orbitCentroid;
    }

    get orbitLine() {
        return this._orbitLine;
    }

    get orbitHighlightColor() {
        return this._orbitHighlightColor;
    }

    set highlight(amplitude) {
        this._highlight = this.createHighlight(amplitude);
    }

    setAxes() {
        this._threeObject.rotation.y = THREE.Math.degToRad(this._axialTilt);
        this._core.rotation.y = THREE.Math.degToRad(this._axialTilt);
    }

    buildFullObject3D() {
        this.setAxes();

        this._orbitLine = new Orbit(this);
        this._orbitCentroid.add(
            this._threeObject,
            this._core,
            this._orbitLine.orbit,
            this._objectCentroid
        );
    }

    createThreeDiameter() {
        return this._diameter * Constants.CELESTIAL_SCALE;
    }

    createThreeRadius() {
        return (this._diameter * Constants.CELESTIAL_SCALE) / 2;
    }

    createThreeDistanceFromParent() {
        return this._distanceFromParent * Constants.ORBIT_SCALE;
    }

    getTexture(src, filter) {
        let texture = this._textureLoader.load(src);
        
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        if(filter) {
            texture.filter = filter;
        }

        return texture;
    }

    createGeometry(surface, atmosphere) {
        let segmentsOffset = Number.parseInt(this._threeDiameter + Constants.OFFSET);
        let mesh = new THREE.Mesh(
            new THREE.SphereGeometry(
                this._threeRadius - 0.1,
                segmentsOffset,
                segmentsOffset,
            )
        );

        mesh.add(surface);

        if(atmosphere) {
            mesh.add(atmosphere);
        }

        return mesh;
    }

    createSurface(base, topo, specular) {
        if(!base) {
            return;
        }

        let segmentsOffset = Number.parseInt(this._threeDiameter + Constants.OFFSET);

        let map = this.getTexture(base), bumpMap, specularMap;
        map.minFilter = THREE.NearestFilter;

        if(topo) {
            bumpMap = this.getTexture(topo);
            bumpMap.minFilter = THREE.NearestFilter;
        }

        if (specular) {
            specularMap = this.getTexture(specular);
            specularMap.minFilter = THREE.LinearFilter;
        }

        let surface = new THREE.MeshPhongMaterial({
            map: map,
            bumpMap: bumpMap || null,
            bumpScale: bumpMap? 0.015 : null,
            specularMap: specularMap || null,
        })

        let mesh = new THREE.Mesh(
            new THREE.SphereGeometry(
                this._threeRadius,
                segmentsOffset,
                segmentsOffset
            ),
            surface
        );

        mesh.rotation.x = THREE.Math.degToRad(90);

        return mesh;
    }

    createAtmosphere(clouds) {
        if (clouds) {
            let segmentsOffset = this.getSphereGeometrySegmentOffset();
            let map = this.getTexture(clouds);
    
            map.minFilter = THREE.LinearFilter;
    
            let mesh = new THREE.Mesh(
              new THREE.SphereGeometry(this._threeRadius * 1.01, segmentsOffset, segmentsOffset),
              new THREE.MeshPhongMaterial({
                map: map,
                transparent: true,
                opacity: 0.9
              })
            );

            mesh.rotation.x = THREE.Math.degToRad(90);
    
            return mesh;
        }
    
        return null;
    }

    createRingGeometry(data) {
        const INNER_RADIUS = THREE.Math.degToRad(data.rings.innerRadius);
        const OUTER_RADIUS = THREE.Math.degToRad(data.rings.outerRadius);
        const THETA_SEGMENTS = 180;
        let geometry = new RadialRingGeometry(
          INNER_RADIUS,
          OUTER_RADIUS,
          THETA_SEGMENTS
        );
  
        let map = this._textureLoader.load(data.rings.textures.base); // THREE.ImageUtils.loadTexture(data.rings.textures.base);
        map.minFilter = THREE.NearestFilter;
  
        let colorMap = this._textureLoader.load(data.rings.textures.colorMap); // THREE.ImageUtils.loadTexture(data.rings.textures.colorMap);
        colorMap.minFilter = THREE.NearestFilter;
  
        let material = new THREE.MeshLambertMaterial({
          map: colorMap,
          alphaMap: map,
          transparent: true,
          opacity: 0.98,
          side: THREE.DoubleSide
        });
  
        let ring = new THREE.Mesh(geometry, material);
        ring.position.set(0, 0, 0);
  
        this._threeObject.add(ring);
    }
  
    createHighlight(amplitude) {
        let resolution = 2880; // segments in the line
        let length = 360 / resolution;
        let highlightDiameter = this._threeDiameter > 4 ? this._threeDiameter * 45 : this._threeDiameter * 75;
        let orbitAmplitude = amplitude || highlightDiameter;
        let orbitLine = new THREE.Geometry();
        let material = new THREE.MeshBasicMaterial({
          color: PLANET_HIGHLIGHT_COLOR,
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
  
    getSphereGeometrySegmentOffset() {
        return Number.parseInt(this._threeDiameter + 1 * 60);
    }
}

export default Planet;