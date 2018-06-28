import L from 'leaflet';
import stops from './stops.js';

var myIcons = [];

stops.features.forEach(function(stop){
  var id = stop.properties.id
  var icon = new L.Icon({
    iconUrl : require(`./../icons/picon_${id}.png`),
    iconSize : [30,40],
    iconAnchor: [15,35]
  })
  myIcons.push(icon);
})

// var myIcons = new L.Icon({
//   iconUrl : require('./../icons/nico.jpg'),
//   iconSize : [35,35]
// })

export default myIcons
