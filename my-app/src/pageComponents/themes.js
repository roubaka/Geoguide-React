import React, { Component } from 'react';
// import logo from './logo.svg';

import '../Geoguide.css';
import 'leaflet/dist/leaflet.css';

import * as firebase from 'firebase';

import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

class Themes extends Component{
  render(){
    return(
      <div>C'est la page des thèmes, c'est encore un peu vague</div>
    )
  }
}

export default Themes;
