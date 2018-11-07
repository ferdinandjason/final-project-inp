'use strict'

import axios from 'axios'

import SolarSystemFactory from './Factory/SolarSystemFactory';

let solarSystemData = null;

import '../app/Utils/Date';

axios.get('data/solarsystem.json')
    .then((response) => {
        solarSystemData = response.data;
        let solarSystemFactory = new SolarSystemFactory(solarSystemData);

        solarSystemFactory.build(solarSystemData).then(() => {
            console.log('Success');
        })
    })