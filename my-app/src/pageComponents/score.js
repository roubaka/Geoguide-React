import React, { Component } from 'react';
// import logo from './logo.svg';

import '../Geoguide.css';
import 'leaflet/dist/leaflet.css';

import * as firebase from 'firebase';

import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

class Score extends Component{
  render(){
    return(
      <div className="PageContent">
        <h1>Score</h1>
        <p>Dans la version finale du Géoguide il y aura plusieurs informations sur les postes visités et sur le taux de réussite aux quiz. On se réjouit!</p>
      </div>
    )
  }
}

export default Score;
