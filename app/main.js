'use strict'

import axios from 'axios'

import SolarSystemFactory from './Factory/SolarSystemFactory';

window.solarSystemData = null;
window.solarSystemFactory = null;

import '../app/Utils/Date';
import TravelController from './Controller/TravelController';

function matchTarget(id) {
    let target = null;
    console.log(window.solarSystemFactory);

    for(var i = 0; i < window.solarSystemFactory.solarSystemObjects.planets.length; i++){
        console.log(window.solarSystemFactory.solarSystemObjects.planets[i].id)
        if(window.solarSystemFactory.solarSystemObjects.planets[i].id === id){
            return window.solarSystemFactory.solarSystemObjects.planets[i];
        }
    }

    for(var i = 0; i < window.solarSystemFactory.solarSystemObjects.moons.length; i++){
        console.log(window.solarSystemFactory.solarSystemObjects.moons[i].id)
        if(window.solarSystemFactory.solarSystemObjects.moons[i].id === id){
            return window.solarSystemFactory.solarSystemObjects.moons[i];
        }
    }

    return target;
}

axios.get('data/solarsystem.json')
    .then((response) => {
        
        window.solarSystemData = response.data;
        window.solarSystemFactory = new SolarSystemFactory(solarSystemData);
        window.travelController = new TravelController(window.solarSystemFactory.scene)

        window.solarSystemFactory.build(solarSystemData).then(() => {
            console.log('Building Complete');
            window.addEventListener('travel.start', (event) => {
                let target = matchTarget(event.detail);
                window.travelController.travelToPlanet(
                    target,
                    target.threeDiameter * 2.5
                );
            })
        })
    })