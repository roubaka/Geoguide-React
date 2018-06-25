import React, { Component } from 'react';
// import logo from './logo.svg';

import '../Geoguide.css';
import 'leaflet/dist/leaflet.css';

import * as firebase from 'firebase';

import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

class Welcome extends Component {
  render(){
    return
    <div>
      <h1>Partez à la (re)découverte de Lausanne avec votre GéoGuide!</h1>
      <p>
        La Faculté des géosciences et de l'environnement de l'Université de Lausanne partage ses sujets de recherche et vous propose de découvrir la ville sous un nouveau regard: Les quartiers changent et se développent, les rivières disparues refont surface, le glacier du Rhône fait pousser des bananes, les toits de Lausanne se trouvent dans l'eau du Léman...
        <br/>
        Partez à la recherche des postes qui se cachent le long du parcours entre Sauvabelin et le campus de l'UNIL. Les 30 postes illustrés traitent de nombreux sujets et vous pourrez tester vos connaissances avec de petits Quiz.
        <br/>
        Pour commencer allez sur la carte et rendez vous au départ de la marche start icon. Une fois sur place, suivez le chemin (ligne rouge) à la recherche d'un poste. Vous verrez, il se manifeste tout seul!
      </p>
    </div>
  }
}

export default Welcome;
