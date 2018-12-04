'use strict'

import axios from 'axios'

import SolarSystemFactory from './Factory/SolarSystemFactory';

window.solarSystemData = null;
window.solarSystemFactory = null;

import '../app/Utils/Date';

axios.get('data/solarsystem.json')
    .then((response) => {
        solarSystemData = response.data;
        solarSystemFactory = new SolarSystemFactory(solarSystemData);

        solarSystemFactory.build(solarSystemData).then(() => {
            console.log('Success');
        })
    })