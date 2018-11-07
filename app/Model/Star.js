'use strict'

import CelestialObject from  './CelestialObject';

class Star extends CelestialObject {
    constructor(data) {
        super(data.diameter, data.mass, data.gravity, data.density);

        this._brightness = 1;
    }
}

//export default Star;