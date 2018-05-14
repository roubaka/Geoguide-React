// -------------------------------------------------- //
// Importing libraries //
// -------------------------------------------------- //
// Import React
import React, { Component } from 'react';

// Importing global variables
import options from './global.js';

// Import local React components
import Login from './pageComponents/login';
import Navbar from './pageComponents/navbar';
import Welcome from './pageComponents/welcome';
import Score from './pageComponents/score';
import Themes from './pageComponents/themes';
import Autres from './pageComponents/autres';

// Import style
import './Geoguide.css';
import 'leaflet/dist/leaflet.css';

// Import firebase
import * as firebase from 'firebase';

// Import jquery and Leaflet libraries
import $ from 'jquery';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

// -------------------------------------------------- //
// Data manipulation //
// -------------------------------------------------- //

// Converting options keys to an array in order to map() through it
var pagesListArray = Object.keys(options);

// -------------------------------------------------- //
// Rendering app components //
// -------------------------------------------------- //

// Main app content to be injected in
var Appcontent;

// Array containing list of spots and their content
var stops = [
  {title:'poste 1',content:'contenu du poste 1'},
  {title:'poste 2',content:'contenu du poste 2'},
  {title:'poste 3',content:'contenu du poste 3'},
  {title:'poste 4',content:'contenu du poste 4'},
];

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
      // TODO change that in the end!
      userLogged : true,
      username : null,
      currentPage : pagesListArray[1],
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

  login = (username,userid) => {
    this.setState({userLogged:true, username:username, userid:userid})
    console.log(username, userid);
  }

  render() {
    if(this.state.userLogged){
      Appcontent =
      <div className="App">
        <header>Here goes the header and main menu!</header>
        <PageContent
          content = {this.state.currentPage} onClick = {this.showSpotContent} stop = {this.state.currentStop}
        />
        <Navbar
          itemList = {pagesListArray} onClick = {this.changePage}
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
