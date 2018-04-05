import React, { Component } from 'react';
// import logo from './logo.svg';
import Login from './login';
import './Geoguide.css';
import 'leaflet/dist/leaflet.css';

import * as firebase from 'firebase';

import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

// Firebase configuration and initialization
// const config = {
//   apiKey: "AIzaSyDA9_FYCQfJKbyE_-V5tPB0Wdzv9pP3-2w",
//   authDomain: "geoguide-react.firebaseapp.com",
//   databaseURL: "https://geoguide-react.firebaseio.com",
//   projectId: "geoguide-react",
//   storageBucket: "",
//   messagingSenderId: "920767176331"
// };

// firebase.initializeApp(config);

// Setting a reference to the database service
// var database = firebase.database();

// -------------------------------------------------- //
// RANDOM TESTS ON FIREBASE
// function databaseTest(index, value) {
//   firebase.database().ref(`/entrytest` + index).set({
//     fieldtest: value
//   });
// }
//
// for (var i=0 ; i<5 ; i++){
//   databaseTest(i, "lalala"); // entering a value one the database accordint to the function
// }
//
// firebase.database().ref('/entrytest').child('childEntry').set({
//   myentry: "ciao"
// });


// -------------------------------------------------- //

// Main app content to be injected in
var Appcontent;

// const { Map: LeafletMap, TileLayer, Marker, Popup } = ReactLeaflet

// Array containing list of spots and their content
var stops = [
  {title:'poste 1',content:'contenu du poste 1'},
  {title:'poste 2',content:'contenu du poste 2'},
  {title:'poste 3',content:'contenu du poste 3'},
  {title:'poste 4',content:'contenu du poste 4'},
];

// Options available in the menu
var options = {
  Bienvenue:{title:'Bienvenue'},
  Carte:{title:'Carte'},
  Postes:{title:'Postes'},
  Score:{title:'Score'},
  Thèmes:{title:'Thèmes'},
  Autres:{title:'Autres'}
};

// Converting options keys to an array in order to map() through it
var optionsArray = Object.keys(options);

// Navbar section
class Navbar extends Component {
  constructor(props){
    super(props);
  }

  render() {
    var navbarItem = optionsArray.map(function(item, i){
       return <li key = {i}>{options[item].title}</li>;
    })
    // Array version
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

// Spot specific Classes
class PostContent extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentStop : null
    }
  }

  render(){
    var currentStop = this.props.stop
    return (
      <div>yeah ceci est le {stops[currentStop-1].content}</div>
    )
  }
}

// Classes for main content
class Welcome extends Component {
  render(){
    return <div>This is the Welcome page</div>
  }
}

class Postes extends Component{
  // constructor(props){
  //   super(props);
  // }
  render(){
    return (
      <ul onClick={this.props.onClick}>
        {stops.map(function(item, i){
          return <li key = {i} value = {i+1}>{stops[i].title}</li>
        })}
      </ul>
    )
  }
}

class Score extends Component{
  render(){
    return(
      <div>This is de Score page, hell yeah!</div>
    )
  }
}

class Themes extends Component{
  render(){
    return(
      <div>C'est la page des thèmes, c'est encore un peu vague</div>
    )
  }
}

class Autres extends Component{
  render(){
    return(
      <div>On ne sait pas encore quoi mettre ici?!</div>
    )
  }
}

// Conditioning rendering for whole page
class PageContent extends Component {
  constructor(props){
    super(props);
  }

  handleClick = () =>{
    this.refs.map.leafletElement.locate()
  }

  render(){
    if(this.props.content == 'Bienvenue'){
      return(
        <Welcome/>
      )
    } else if (this.props.content == 'Carte'){
    return(
        <Map id='map' ref='map' center={[45.0,6.5]} zoom={5} onClick={this.handleClick} onLocationFound={function(e){
          console.log(e.latlng);
          console.log(e.accuracy);
          console.log(e.time);
        }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
        </Map>
    )
    } else if (this.props.content == 'Postes'){
      return(
        <Postes onClick = {this.props.onClick}/>
      )
    } else if (this.props.content == 'PostContent'){
      return(
        <PostContent stop={this.props.stop}/>
      )
    } else if(this.props.content == 'Score'){
      return (
        <Score/>
      )
    } else if(this.props.content == 'Thèmes'){
      return(
        <Themes/>
      )
    } else if(this.props.content == 'Autres'){
      return(
        <Autres/>
      )
    }
  }
}

// -------------------------------------------------- //
// Final App rendering
class Geoguide extends Component {
  constructor(props){
    super(props);
    this.state = {
      userLogged : false,
      currentPage : optionsArray[0],
      currentStop : null
    }
  }

  changePage = (e) => {
    this.setState({currentPage : e.target.innerHTML})
  }

  showSpotContent = (e) => {
    this.setState({currentPage : 'PostContent'})
    this.setState({currentStop: e.target.value})
    // e.target.value
  }

  login = () => {
    this.setState({userLogged : true})
  }

  render() {
    if(this.state.userLogged){
      Appcontent =
      <div className="App">
        <header>Here goes the header and main menu!</header>
        <Navbar
          itemList = {optionsArray} onClick = {this.changePage}
        />
        <PageContent
          content = {this.state.currentPage} onClick = {this.showSpotContent} stop = {this.state.currentStop}
        />
      </div>
    } else {
      Appcontent =
      <Login onClick={this.login}/>
    };
    return (Appcontent);
  }
}



export default Geoguide;
