import L from 'leaflet';
import stops from './stops.js';

var locationIcon = new L.Icon({
  iconUrl : require('./../icons/current-location.png'),
  iconSize : [30, 30],
  iconAnchor : [15,15]
});

export default locationIcon;
