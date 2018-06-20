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
import Questionnary from './pageComponents/questionnary';
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

// Import style
import './Geoguide.css';
import 'leaflet/dist/leaflet.css';

// -------------------------------------------------- //
// -------------------------------------------------- //
// Data manipulation //
// -------------------------------------------------- //
// -------------------------------------------------- //


// Converting options keys to an array in order to map() through it
var optionsArray = Object.keys(options);

// -------------------------------------------------- //
// -------------------------------------------------- //
// Rendering app components //
// -------------------------------------------------- //
// -------------------------------------------------- //

// Main app content to be injected in
var Appcontent;
var database = firebase.database();

// -------------------------------------------------- //
// Component for content of stop
// -------------------------------------------------- //
class StopContent extends Component{
  constructor(props){
    super(props);
    this.state = {
      // currentStop : null
      content : 'basic',
      answeredQuiz : false,
      shuffledOnce : false,
    }
  }

  // Method showing extended content
  extendContent = () => {
    console.log(this.props);
    this.setState({content:'extended'})
    // Log into DB - interaction click, extendedContent of the post
    this.props.trackInteraction('IN','click','extendedContent',this.props.stop)
  }

  // Method showing quiz content
  quizContent = () => {
    this.setState({content:'quiz'})
    this.props.renderNavbar(false)
  }

  // Method handling answering of the quiz
  handleQuiz = () => {
    this.setState({answeredQuiz : true})
    this.props.renderNavbar(true)
  }

  // Shuffling the answers of the quiz
  shuffleAnswers = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    this.setState({shuffledOnce : true})
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
          } else if(this.state.shuffledOnce) {
            // If the user hasn't answered quiz, shuffle the answers
            this.shuffleAnswers(answers);
          }
          // In any case, render td + button
          var answerTag = <td><button style = {answerStyle} answernumber = {`${i+1}`} width = '200px' onClick = {this.handleQuiz}>{currentData[`answer${i+1}`]}</button></td>
          answers.push(answerTag)
          // If user has answered the question, add button to go back to map
          var backToMap = ''
          if(this.state.answeredQuiz){
            var self = this;
            backToMap = <button onClick = {this.props.showMap}>Je continue mon chemin!</button>
          }
        }
        postContent =
          <div>
            <table>
              <tbody>
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
              </tbody>
            </table>
            {backToMap}
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
      // Parameter for centering the map according to user's location
      followingLocation : true,
      // User location marker
      location : [0,0],
      locationAccuracy : 0
    }
  }

  // Updating location point and map focus when new location is found
  onLocationFound = (position) => {
    console.log(position);
    this.setState({location: [position.coords.latitude,position.coords.longitude]});
    this.setState({locationAccuracy : position.coords.accuracy});
    // To avoid conflict when calling this on callback function
    // replace component's "this" as self variable
    var self = this;
    window.setTimeout(function(){
      navigator.geolocation.getCurrentPosition(self.onLocationFound, self.onLocationError);
    }, 1000);

    // If the user is tracking the location
    if(this.state.followingLocation){
      this.setState({center: [position.coords.latitude,position.coords.longitude]});
    }

    // Check for each feature if the
    stops.features.forEach(function(stop){
      // Store coordinates of each points as variable S
      var s = stop.geometry.coordinates;
      // Pythagore function - calculate distance betweeen location and every stop
      var d = Math.pow(Math.pow(s[0] - position.coords.latitude, 2) + Math.pow(s[1] - position.coords.longitude, 2), 0.5);
        // If distance, trigger showSpotContent function
        // NB default parameter for distance is 0.0002
        if (d < 0.0002){
          // if(d < 0.002){
          // Actual stop number
          console.log(stop.properties.id);
          self.props.onStopReached(stop.properties.id);
        }
    })
  }

  // Location error handling
  onLocationError = () => {
    // To avoid conflict when calling this on callback function
    // replace component's "this" as self variable
    var self = this;
    console.log('position error');
    window.setTimeout(function(){
      navigator.geolocation.getCurrentPosition(self.onLocationFound, self.onLocationError);
    }, 1000);
  }

  // Updating center state as panning
  handlePan = (e) => {
    this.setState({center: e.target.getCenter()});
    this.setState({followingLocation : false});
  }

  // Updating zoom state as zoomed
  handleZoom = (e) => {
    this.setState({zoom: e.target.getZoom()});
    this.setState({followingLocation : false});
  }

  // Focus on current location
  focusLocation = () => {
    this.setState({center : this.state.location});
    this.setState({zoom : 16});
    this.setState({followingLocation : true});
  }

  // Keep records of the user's interaction into firebase
  trackInteraction = (indicator,interaction,data,stop) => {
    database.ref('/interactions').push({
      username : this.props.username,
      indicator : indicator,
      interaction : interaction,
      data : data,
      stop : stop
    })
  }

  // When the map is loaded, get user location
  componentDidMount(){
    this.setState({mapShown : true})
    //this.refs.map.leafletElement.locate()

    if ("geolocation" in navigator) {
      console.log('asking for geolocation');
      navigator.geolocation.getCurrentPosition(this.onLocationFound, this.onLocationError);
      // navigator.geolocation.watchPosition(this.onPositionFound, this.onPositionError, {
      //   enableHighAccuracy: true, maximumAge: 30000, timeout: 27000
      // });
      //var watchID = navigator.geolocation.watchPosition(this.onPositionFound);
    } else {
      console.log('geolocation IS NOT available')
    }

  }

  // Defining which page to render into PageContent Component
  render(){
    // Storing handleClick props into a variable for use into callback functions
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
        <div ref='mymap'>
          {/* Map with initial parameters */}
          <Map id='map' ref='map' center={this.state.center} zoom={this.state.zoom}
            // Handling changed on focus when interacting with the map
            onDragend={this.handlePan} onZoomend={this.handleZoom}>
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
      return(
        <StopContent
          // Passing methods about changing pages and rendering
          showMap = {this.props.showMap} stop={this.props.stop} renderNavbar={this.props.renderNavbar}
          // Passing tarckingLog method
          trackingLog={this.trackInteraction}
        />
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
      // Check in localstorage if user has already been userLogged
      // If there is a user in localStorage, set logged true and username as username
      userLogged : localStorage.getItem('username') ? true : false,
      // Set username and userid state from the data stored in localStorage
      username : localStorage.getItem('username'),
      userid : localStorage.getItem('userid'),
      // States about page content and rendering
      currentPage : 'Carte',
      currentStop : null,
      renderNavbar : true,
      width : window.innerWidth
    }
  }

  // When user identifies himself, set state and localStorage with entered values
  login = (username,userid) => {
    this.setState({userLogged:true, username:username, userid:userid})
    // Set localStorage username and userid as entered
    localStorage.setItem('username',this.state.username)
    localStorage.setItem('userid',this.state.userid)
    // Checking data in the db, if they don't exist update them
    if(this.checkUserData('i11') == undefined){
      console.log("value does not exist yet");
      this.updateUserData('i11','entered')
    }
  }

  // Methods getting and setting user data into DB
  checkUserData = (indicator) => {
    let userData;
    database.ref('/users').once('value', snap =>{
      // console.log(snap.child(this.state.userid).val()[indicator]);
      if(snap.child(this.state.userid).val()[indicator]){
        userData = true;
      } else {
        userData = false;
      }
    })
      console.log(userData);
      return userData
  }

  // Updating user data info DB
  updateUserData = (indicator,value) => {
    database.ref('/users').child(this.state.userid).update({
      [indicator] : value
    })
  }

  // Methods handling page changes and rendering
  showMap = () => {
    this.setState({currentPage : 'Carte'})
    this.setState({currentStop : null})
  }

  changePage = (e) => {
    this.setState({currentPage : e.target.innerHTML})
    this.setState({currentStop : null})
  }

  // Handling rendering for navbar
  renderNavbar = (boolean) => {
    if(boolean){
      this.setState({renderNavbar : true})
    } else {
      this.setState({renderNavbar : false})
    }
  }

  // Method pages change
  handleMarkerClick = (e) => {
    this.setState({currentStop : e.target.options.value})
    this.setState({currentPage : 'StopContent'})
  }

  showSpotContent = (e) => {
      // showSpotContent triggered when stop in list is clicked and stop is reached
      if(isNaN(e)){
        // If parameter e isNaN, > get value of e.target
        console.log(e.target.value);
        this.setState({currentStop: e.target.value})
        this.setState({currentPage : 'StopContent'})
      } else {
        // Else, stop was reached > get e
        // NB set to e-14 for test with geolocation arriving on fake last post
        // this.setState({currentStop : e-14})
        this.setState({currentStop : e})
        this.setState({currentPage : 'StopContent'})
      }
    }

  render() {
    console.log(this.state.userid);

    // Storing navbar into variable, completed only if page content is not a quiz
    var navbar = '';
    if(this.state.renderNavbar){
      navbar = <Navbar itemList = {optionsArray} onClick = {this.changePage}/>
    }

    // If user data is found into localStorage
    if(this.state.userLogged){
      return(
        <div className="App">
          <header>Here goes the header</header>
          <span>Logué en tant que {this.state.username}</span>
          <PageContent
            // Passing information about user
            userid={this.state.userid} username={this.state.username} updateUserData={this.updateUserData}
            // Pasing methods about changing pages and rendering
            showMap = {this.showMap} content = {this.state.currentPage} onClick = {this.showSpotContent} renderNavbar = {this.renderNavbar}
            // Passing methods about map
            handleClick={this.handleMarkerClick} stop = {this.state.currentStop} onStopReached = {this.showSpotContent}
          />
          {/* Navbar component showing only if page is not a quiz */}
          {navbar}
        </div>
      )
    // If no user data is found into localStorage
    } else {
      return (
        <Login onClick={this.login}/>
      )
    }
  }
}

export default Geoguide;
