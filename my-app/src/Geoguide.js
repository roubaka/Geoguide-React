// -------------------------------------------------- //
// Importing libraries //
// -------------------------------------------------- //
// Import React
import React, { Component } from 'react';

// Import firebase
import * as firebase from 'firebase';

// Import jquery and Leaflet libraries
import L from 'react-leaflet'; //to avoid conflict with webpack require
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import $ from 'jquery';

// Import local React components
import Login from './pageComponents/login';
import Navbar from './pageComponents/navbar';
import Welcome from './pageComponents/welcome';
import Score from './pageComponents/score';
import Themes from './pageComponents/themes';
import Others from './pageComponents/others';

// Importing global variables
import options from './data/options.js';
// import stops from './data/stops.js';
import stopsData from './data/stops_content_min.js';

// Import style
import './Geoguide.css';
import 'leaflet/dist/leaflet.css';

// -------------------------------------------------- //
// Data manipulation //
// -------------------------------------------------- //

// Converting options keys to an array in order to map() through it
var pagesListArray = Object.keys(options);
// var stopsArray = Object.keys(stopsData);

console.log(stopsData);
console.log(pagesListArray);

// console.log(stopsArray);

// -------------------------------------------------- //
// Rendering app components //
// -------------------------------------------------- //

// Main app content to be injected in
var Appcontent;

class Quiz extends Component{
  constructor(props){
    super(props);
  }

  render(){

    return(
      <div>
        Hey! I'm a quiz!
      </div>
    )
  }
}

// Spot specific Classes
class StopContent extends Component{
  constructor(props){
    super(props);
    this.state = {
      // currentStop : null
      content : 'basic'
    }
  }

  extendContent = () => {
    this.setState({content:'extended'})
  }

  quizContent = () => {
    this.setState({content:'quiz'})
  }

  render(){
    // Compensate for decay in values - initializing at 6
    var arrayDecay = 6
    // storing id stop in currentData
    var currentData = stopsData[this.props.stop - arrayDecay]
    // console.log(currentData[this.props.stop].img_swip1)
    var postContent;
      // Conditional rendering for StopContent

      // Rendering basic content
      if(this.state.content == 'basic'){
        postContent =
          <div>
            <h1>{currentData.title}</h1>
            <img src = {require(`./img/poste_${this.props.stop}.jpg`)} width = {'auto'} height = {'300px'}/>
            <p>{currentData.text1_p1}</p>
            <p>{currentData.text1_p2}</p>
            {/* buttons */}
            <button onClick = {this.extendContent}>{currentData.interaction} </button><br/>
            <button onClick = {this.props.showMap} >{currentData.followtrack}</button>
          </div>
      // Rendering extended content
      } else if (this.state.content == 'extended'){
        postContent =
          <div>
            <h1>{currentData.title}</h1>
            <img src = {require(`./img/poste_${this.props.stop}.jpg`)} width = {'auto'} height = {'300px'}/>
            <p>{currentData.text1_p1}</p>
            <p>{currentData.text1_p2}</p>
            {/* <img src = {require(`./img/${currentData[this.props.stop].img_swip1}`)} width = {'auto'} height = {'300px'}/> */}
            <p>{currentData.text2_p1}</p>
            <p>{currentData.text2_p2}</p>
            <span>{currentData.img_swip_legend}</span>
            {/* buttons */}
            <button onClick = {this.quizContent} >Je veux participer au Quiz!</button><br/>
            <button onClick = {this.props.showMap} >{currentData.followtrack}</button>
          </div>
      // Rendering quiz content
      } else if (this.state.content == 'quiz'){
        postContent =
          <div>
            Ceci est un maquessi quiz
          </div>
      }
      return(postContent);
  }
}

// List of
class Stops extends Component{
  // constructor(props){
  //   super(props);
  // }
  render(){
    return (
      <ul onClick={this.props.onClick}>
        {stopsData.map(function(item, i){
          return <li key = {i} value = {stopsData[i].id}>{`${stopsData[i].id} - ${stopsData[i].name}`}</li>
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

  // Defining which page to render into PageContent Component
  render(){
    // Rendering Welcome page
    if(this.props.content == 'Bienvenue'){
      return(
        <Welcome/>
      )
    // Rendering Map page
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
    // Rendering Stops page

  } else if (this.props.content == 'Postes'){
      return(
        // onClick props only has parameters when Geoguide-currentPage = Postes
        <Stops onClick = {this.props.onClick}/>
      )
    // Rendering StopContent page
    } else if (this.props.content == 'StopContent'){
      return(
        <StopContent showMap = {this.props.showMap} stop={this.props.stop}/>
      )
    // Rendering Score page
    } else if(this.props.content == 'Score'){
      return (
        <Score/>
      )
    // Rendering Themes page
    } else if(this.props.content == 'Themes'){
      return(
        <Themes/>
      )
    // Rendering Others page
    } else if(this.props.content == 'Autres'){
      return(
        <Others/>
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

  showMap = () => {
    this.setState({currentPage : 'Carte'})
    this.setState({currentStop : null})
  }

  changePage = (e) => {
    this.setState({currentPage : e.target.innerHTML})
    this.setState({currentStop : null})
  }

  showSpotContent = (e) => {
    this.setState({currentPage : 'StopContent'})
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
        <header>Here goes the header</header>
        <PageContent
          showMap = {this.showMap} content = {this.state.currentPage} onClick = {this.showSpotContent} stop = {this.state.currentStop}
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
