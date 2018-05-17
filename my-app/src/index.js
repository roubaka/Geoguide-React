import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import Geoguide from './Geoguide';
import registerServiceWorker from './registerServiceWorker';

// jQuery test - works!
// $('body').css('background-color','blue');

// Original log function
// Geoguide.log = function(i, data){
//   $.ajax({
//     type: 'POST',
//     url: 'https://geo.naxio.ch/geoguidegm/log.php',
//     // url : 'log.html',
//     data: {'i': JSON.stringify(i), 'data': JSON.stringify(data), 'uuid': Geoguide.state.get('UUID')},
//     success: function(){
//       console.log(JSON.stringify(i));
//       console.log(JSON.stringify(data));
//     },
//     dataType: 'text'
//   });
//   console.log(i);
//   console.log(data);
// }

ReactDOM.render(<Geoguide />, document.getElementById('root'));
  registerServiceWorker();
