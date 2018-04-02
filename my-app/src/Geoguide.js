import React, { Component } from 'react';
// import { Text } from 'react-native'; 
import logo from './logo.svg';
import './Geoguide.css';
import 'leaflet/dist/leaflet.css';
import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

// Main app content
var Appcontent;

var test = true;

// HTML template for Map
var mapSection =
  <div>
    <div>Ceci est une carte</div>
  </div>;

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
      currentPage : optionsArray[0],
      currentStop : null
    }
  }

  changePage = (e) => {
    this.setState({currentPage : e.target.innerHTML})
  }

  showSpotContent = (e) => {
    var k = e.target.value;
    this.setState({currentPage : 'PostContent'})
    this.setState({currentStop: k})
  }

  render() {
    if(test === true){
      Appcontent =
      <div className="App">
        <header>Here goes the header and main menu!</header>
        <Navbar
          itemList={optionsArray} onClick={this.changePage}
        />
        <PageContent
          content = {this.state.currentPage} onClick={this.showSpotContent} stop={this.state.currentStop}
        />
      </div>
    } else {
      // Stupid test for condition
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
    };
    return (Appcontent);
  }
}



export default Geoguide;
