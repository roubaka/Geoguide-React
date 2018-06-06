// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing libraries //
// -------------------------------------------------- //
// -------------------------------------------------- //
// Import React
import React, { Component } from 'react';

// Import firebase
import * as firebase from 'firebase';

// Import jquery and Leaflet libraries
// import L from 'react-leaflet'; //to avoid conflict with webpack require
import L from 'leaflet';
import Control from 'react-leaflet-control';
import {Map, TileLayer, Marker, Popup, Polyline, Icon, Circle, MapControl} from 'react-leaflet';
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
import stops from './data/stops.js';
import stopsData from './data/stops_content_min.js';
import track from './geodata/track.js';
import myIcons from './data/icons.js';
import locationIcon from './data/location_icon.js';
// import control from './data/control.js';

// Import style
import './Geoguide.css';
import 'leaflet/dist/leaflet.css';

// -------------------------------------------------- //
// -------------------------------------------------- //
// Data manipulation //
// -------------------------------------------------- //
// -------------------------------------------------- //

// Converting options keys to an array in order to map() through it
var pagesListArray = Object.keys(options);

// -------------------------------------------------- //
// -------------------------------------------------- //
// Rendering app components //
// -------------------------------------------------- //
// -------------------------------------------------- //

// Main app content to be injected in
var Appcontent;

// -------------------------------------------------- //
// Component for content of stop
// -------------------------------------------------- //
class StopContent extends Component{
  constructor(props){
    super(props);
    this.state = {
      // currentStop : null
      content : 'basic',
      answeredQuiz : false
    }
  }

  // Method showing extended content
  extendContent = () => {
    this.setState({content:'extended'})
  }

  // Method showing quiz content
  quizContent = () => {
    this.setState({content:'quiz'})
  }

  // Method handling anwering of the quiz
  handleQuiz = () => {
    this.setState({answeredQuiz : true})
  }

  // Shuffling the answers of the quiz
  shuffleAnswers = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

  render(){
    // Compensate for decay in values - initializing at 6
    var arrayDecay = 6
    console.log(this.props.stop);
    // storing id stop in currentData
    var currentData = stopsData[this.props.stop - arrayDecay]
    // console.log(currentData[this.props.stop].img_swip1)
    var postContent;
      // Conditional rendering for StopContent

      // 1) Rendering basic content
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
      // 2) Rendering extended content
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
      // 3) Rendering quiz content
      } else if (this.state.content == 'quiz'){

        // Style for answers
        var wrongAnser = {
          backgroundColor : 'red'
        }
        var rightAnswer = {
          backgroundColor : 'lightgreen'
        }

        // Preparing answers
        var answers = []
        for(let i = 0; i < 4; i++){
          let answerStyle;
          // If user answered question change style
          if(this.state.answeredQuiz){
            // Styling for the various answers
            // If current answer is the right one, set style to right
            if(i+1 == currentData.correct){
              answerStyle = rightAnswer;
              // Otherwise set style to wrong
            } else {
              answerStyle = wrongAnser;
            }
          } else {
            // If the user hasn't answered quiz, shuffle the answers
            this.shuffleAnswers(answers);
          }
          // In any case, render td + button
          var answerTag = <td><button style = {answerStyle} answernumber = {`${i+1}`} width = '200px' onClick = {this.handleQuiz}>{currentData[`answer${i+1}`]}</button></td>
          answers.push(answerTag)
        }
        postContent =
          <div>
            <table><tbody>
              <tr>
                <th width = '400px' colSpan = '2'>{currentData.question}</th>
              </tr>
              <tr>
                {answers[0]}
                {answers[1]}
              </tr>
              <tr>
                {answers[2]}
                {answers[3]}
              </tr>
            </tbody></table>
          </div>
      }
      return(postContent);
  }
}

// -------------------------------------------------- //
// Component for list of stops
// -------------------------------------------------- //
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

// -------------------------------------------------- //
// Component for content of the page
// -------------------------------------------------- //
class PageContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      mapShown : false,
      // Parameters of the map
      center : [46.524, 6.633],
      zoom : 13,
      trackingLocation : true,
      // User location marker
      location : [0,0],
      locationAccuracy : 0
    }
  }

  // Updating location point and map focus when new location is found
  handleLocation = (e) => {
    this.setState({location: e.latlng});
    this.setState({locationAccuracy : e.accuracy});
    alert(this.state.location)
    alert(e.latlng)
    if(this.state.trackingLocation){
      this.setState({center: e.latlng});
    }
    stops.features.forEach(function(stop){
      var s = stop.geometry.coordinates;
      var d = Math.pow(Math.pow(s[1] - e.latlng.lat, 2) + Math.pow(s[0] - e.latlng.lng, 2), 0.5);
        console.log(d);
        if (d < 0.0002){
          alert("maquessssi");
        }
    })
    // stops.forEach(console.log(this))
  }

  // Updating center state as panning
  handlePan = (e) => {
    this.setState({center: e.target.getCenter()});
    this.setState({trackingLocation : false});
  }

  // Updating zoom state as zoomed
  handleZoom = (e) => {
    this.setState({zoom: e.target.getZoom()});
    this.setState({trackingLocation : false});
  }

  // Focus on current location
  focusLocation = () => {
    this.setState({center : this.state.location});
    this.setState({zoom : 16});
    this.setState({trackingLocation : true});
  }

  // When the map is loaded, get user location
  componentDidMount(){
    this.setState({mapShown : true})
    console.log(this.state.mapShown);
    this.refs.map.leafletElement.locate({watch:true})
  }

  // Defining which page to render into PageContent Component
  render(){
    var handleClick = this.props.handleClick;
    // -------------------------------------------------- //
    // Rendering Welcome page
    if(this.props.content == 'Bienvenue'){
      return(
        <Welcome/>
      )
    // -------------------------------------------------- //
    // Rendering Map page
    } else if (this.props.content == 'Carte'){
      var mapShown = this.state.mapShown

      // Track - trackComplete variable for storing track with correct coordinates
      var trackComplete = [];
      // Reversing latlng coordinates
      track.features.forEach(function(segment){
        // forEach feature, reverse each point coordinates
        segment.geometry.coordinates.forEach(function(point){
          if(mapShown == false){
            point.reverse();
          }
        })
        // Add reversed coordinates into trackComplete variable
        trackComplete.push(segment.geometry.coordinates);
      });

    return(
        <div>
          <Map id='map' ref='map' center={this.state.center} zoom={this.state.zoom}
            onLocationFound={this.handleLocation} onDragend={this.handlePan} onZoomend={this.handleZoom}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {/* Polyline for track */}
            <Polyline color="red" positions={trackComplete}/>
            {/* Loop for adding every marker according to its and position */}
            {stops.features.map(function(stop){
              var id = stop.properties.id
              var coords = stop.geometry.coordinates
              if(mapShown == false){
                coords.reverse();
              }
              return <Marker key={id} icon={myIcons[id-1]} value={id} position={coords} onClick={handleClick}/>
            })}
            <Marker icon={locationIcon} position={this.state.location}/>
            <Circle center={this.state.location} radius={this.state.locationAccuracy}/>
            <Control position='topright'>
              <button onClick={this.focusLocation}>Centrer</button>
            </Control>
            {/* <MapControl position='topright'/> */}
          </Map>
        </div>
    )

  // -------------------------------------------------- //
  // Rendering Stops page
  } else if (this.props.content == 'Postes'){
      return(
        // onClick props only has parameters when Geoguide-currentPage = Postes
        <Stops onClick = {this.props.onClick}/>
      )
    // -------------------------------------------------- //
    // Rendering StopContent page
    } else if (this.props.content == 'StopContent'){
      console.log(this.props.stop);
      return(
        <StopContent showMap = {this.props.showMap} stop={this.props.stop}/>
      )
    // -------------------------------------------------- //
    // Rendering Score page
    } else if(this.props.content == 'Score'){
      return (
        <Score/>
      )
    // -------------------------------------------------- //
    // Rendering Themes page
    } else if(this.props.content == 'Themes'){
      return(
        <Themes/>
      )
    // -------------------------------------------------- //
    // Rendering Others page
    } else if(this.props.content == 'Autres'){
      return(
        <Others/>
      )
    }
  }
}

// -------------------------------------------------- //
// Component for Final App rendering
// -------------------------------------------------- //
class Geoguide extends Component {
  constructor(props){
    super(props);
    this.state = {
      // TODO when finished set userLogged initial state to false
      userLogged : true,
      username : null,
      currentPage : pagesListArray[1],
      currentStop : null,
      width : window.innerWidth
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

  handleMarkerClick = (e) => {
    this.setState({currentStop : e.target.options.value})
    this.setState({currentPage : 'StopContent'})
  }

  showSpotContent = (e) => {
    this.setState({currentStop: e.target.value})
    this.setState({currentPage : 'StopContent'})
  }

  login = (username,userid) => {
    this.setState({userLogged:true, username:username, userid:userid})
    console.log(username, userid);
  }

  render() {
    if(this.state.userLogged){
      Appcontent =
      <div className="App">
        <header>Here goes the header hého</header>
        <PageContent
          showMap = {this.showMap} content = {this.state.currentPage} onClick = {this.showSpotContent} handleClick={this.handleMarkerClick} stop = {this.state.currentStop}
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
