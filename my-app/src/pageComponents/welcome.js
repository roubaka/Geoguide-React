import React, { Component } from 'react';
// import logo from './logo.svg';

import '../Geoguide.css';
import 'leaflet/dist/leaflet.css';

import * as firebase from 'firebase';

import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

class Welcome extends Component {
  render(){
    return <div>This is the Welcome page</div>
  }
}

export default Welcome;
