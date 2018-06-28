import React, { Component } from 'react';
// import logo from './logo.svg';

import {Footer} from 'react-materialize';
import '../Geoguide.css';
import 'leaflet/dist/leaflet.css';

import * as firebase from 'firebase';

import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

import options from '../data/options.js';

// Converting options keys to an array in order to map() through it
var optionsArray = Object.keys(options);

// Class navbar for navigating through the different pages
class Navbar extends Component {
  constructor(props){
    super(props);
  }



  render() {
    var tableStyle = {
      width:window.innerHeight/4+'px'
    }
    var navbarItem = optionsArray.map(function(item, i){
       return <td key = {i} colSpan={1} value = {options[item].name}>{options[item].title}</td>;
    })
    // Array version for mapping through the options
    // var navbarItem = options.map(function(item, i){
    //   return <li key = {i}> {item.title} </li>;
    // })
    return(
        <table className="navbar">
          <tbody>
            <tr colSpan={4} onClick = {this.props.onClick}>
              {navbarItem}
            </tr>
          </tbody>
        </table>
    )
  }
}

export default Navbar;
