import * as THREE from 'three';

class Clock extends THREE.Clock {
    constructor(autoStart) {
        super(autoStart);
    }
}

export default Clock;