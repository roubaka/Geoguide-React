import React, { Component } from 'react';
// import logo from './logo.svg';

import Login from './login';
import './Geoguide.css';
import 'leaflet/dist/leaflet.css';

import * as firebase from 'firebase';

import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

// Listing available in the navbar
var options = {
  Bienvenue:{title:'Bienvenue'},
  Carte:{title:'Carte'},
  Postes:{title:'Postes'},
  Score:{title:'Score'},
};

// Converting options keys to an array in order to map() through it
var pagesListArray = Object.keys(options);

// Class navbar for navigating through the different pages
class Navbar extends Component {
  constructor(props){
    super(props);
  }

  render() {
    var navbarItem = pagesListArray.map(function(item, i){
       return <li key = {i}>{options[item].title}</li>;
    })
    // Array version for mapping through the options
    // var navbarItem = options.map(function(item, i){
    //   return <li key = {i}> {item.title} </li>;
    // })
    return(
      <ul onClick = {this.props.onClick}>
        {navbarItem}
      </ul>
    )
  }
}

export default Navbar;
