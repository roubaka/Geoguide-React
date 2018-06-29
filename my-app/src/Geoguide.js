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
import locationIcon from './data/location_icon.js';
import myIcons from './data/icons.js';
import options from './data/options.js';
import questionnaries from './data/questionnaries.js';
import stops from './data/stops.js';
import questionStops from './geodata/questionStops.js';
import stopsData from './data/stops_content_min.js';
import track from './geodata/track.js';

// Import style
import './Geoguide.css';
import 'leaflet/dist/leaflet.css';

// -------------------------------------------------- //
// -------------------------------------------------- //
// Data and manipulation //
// -------------------------------------------------- //
// -------------------------------------------------- //

// Converting options keys to an array in order to map() through it
var optionsArray = Object.keys(options);

// Setting the first indicator List to be checked in this order
var indicatorString;
var indicatorsList;
var nextQuestionStop = 0;

// Global function for updating indicators list
var getIndicatorsList = (i) => {
  indicatorString = questionStops.features[i].properties.indicator;
  indicatorsList = indicatorString.split(",").map(String);
  return indicatorsList
}

// Initializing indicator list as the first ones to be get
getIndicatorsList(nextQuestionStop);

// Reversing coordinates of questionStops features
questionStops.features.map(function(stop){
  var id = stop.properties.id
  var coords = stop.geometry.coordinates
  coords.reverse();
})

// mapShown variable set to false for reversing coordinates on first rendering
var mapShown = false;

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
      quizArray : []
    }
  }

  // Method showing extended content
  extendContent = () => {
    var stopsExtended = JSON.parse(localStorage.getItem('i22'))
    stopsExtended[this.props.stop-6] = 'extended'
    localStorage.setItem('i22',JSON.stringify(stopsExtended))
    database.ref('/users').child(this.props.userid).update({
      'i22' : stopsExtended
    }).then(this.setState({content:'extended'}))

    // Log into DB - interaction click, extendedContent of the post
    this.props.trackInteraction('i22 stop'+this.props.stop,'click','extended content')
  }

  // Method showing quiz content
  quizContent = () => {
    this.setState({content:'quiz'})
    if(this.state.answeredQuiz == false){
      this.props.renderNavbar(false)
    }
  }

  // Method handling answering of the quiz
  handleQuiz = (e) => {
    // Handling update of the ansers into db
    if(this.state.answeredQuiz == false){
      var answer = e.target.attributes.getNamedItem('answer').value;
      var quizResult = JSON.parse(localStorage.getItem('i33'))
      quizResult[this.props.stop-6] = answer
      localStorage.setItem('i33',JSON.stringify(quizResult))
      database.ref('/users').child(this.props.userid).update({
        'i33' : quizResult
      }).then(() => {
        this.setState({answeredQuiz : true})
        this.props.renderNavbar(true)
        this.props.trackInteraction('i33 stop'+[this.props.stop],'click','answered quiz')
      })
    }
  }

  // Shuffling the answers of the quiz
  shuffleAnswers = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  componentDidMount = () => {
    // Setting array to shuffle the answers
    var array = [0,1,2,3]
    array = this.shuffleAnswers(array);
    this.setState({quizArray : array})
    console.log('fzfhg');
    // Cecking localStorage to know if user has already answered this post questions
    // json parse to get the array located
    // If value is different from 0 (equals true or false) it means user has already answered the question, hence change state
    if(JSON.parse(localStorage.getItem('i33'))[this.props.stop-6] != 0){
      console.log("state");
      this.setState({answeredQuiz : true})
    }
  }

  render(){
    // Compensate for decay in values - initializing at 6
    var arrayDecay = 6

    // storing id stop in currentData
    var currentData = stopsData[this.props.stop - arrayDecay]
    var postContent;

    // Complementary images for extended content, based on swip in original version
    var img_swipList = ['img_swip1','img_swip2','img_swip3','img_swip4','img_swip5','img_swip6','img_swip7','img_swip8'];
    var img_swip = [];

    img_swipList.forEach(function(img, index){
      var legend = `img_swip${index+1}_legend`
      if(currentData[img]){
        let imgSrc = currentData[img];
        img_swip.push(
          <div>
            <img src = {require(`./img/${imgSrc}`)} width = {'auto'} height = {'auto'}/><br/>
            <p className="imgLegend">{currentData[legend]}</p>
          </div>
        )
      }
    })

      // Conditional rendering for StopContent

      // 1) Rendering basic content
      if(this.state.content == 'basic'){
        postContent =
          <div className="postContent">
            <h1>{currentData.title}</h1>
            <img src = {require(`./img/poste_${this.props.stop}.jpg`)} width = {'auto'} height = {'auto'}/>
            <p>{currentData.text1_p1}</p>
            <p>{currentData.text1_p2}</p>
            {/* buttons */}
            <button onClick = {this.extendContent}>{currentData.interaction} </button><br/>
            <button onClick = {this.props.showMap} >{currentData.followtrack}</button>
          </div>
      // 2) Rendering extended content
      } else if (this.state.content == 'extended'){
        postContent =
          <div className="postContent">
            <h1>{currentData.title}</h1>
            <img src = {require(`./img/${currentData.img_title}`)} width = {'auto'} height = {'auto'}/>
            <p>{currentData.text1_p1}</p>
            <p>{currentData.text1_p2}</p>
            <div>{img_swip}</div>
            <p>{currentData.text2_p1}</p>
            <p>{currentData.text2_p2}</p>
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

        // Preparing answers possibilities into array
        var answers = []

        for(let i = 0; i < 4; i++){
          var self = this;

          // Preparing variable to be given for
          var answer = (i+1 == currentData.correct) ? 'true' : 'false';
          // Variable storing anserstyling
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
          }
          // In any case, render td + button
          var answerTag =
            <button style={answerStyle} answernumber={`${i+1}`} answer={answer} width='200px' onClick={self.handleQuiz}>
              {currentData[`answer${i+1}`]}
            </button>
          answers.push(answerTag)
          // If user has answered the question, add button to go back to map
          var backToMap = ''
          if(this.state.answeredQuiz){
            backToMap = <button onClick = {this.props.showMap}>Je continue mon chemin!</button>
          }
        }

        var shuffledArray = this.state.quizArray;

        postContent =
          <div className="postContent">
            <h1>{currentData.question}</h1>
            {answers[shuffledArray[0]]}<br/>
            {answers[shuffledArray[1]]}<br/>
            {answers[shuffledArray[2]]}<br/>
            {answers[shuffledArray[3]]}<br/>
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
    this.setState({location: [position.coords.latitude,position.coords.longitude]});
    this.setState({locationAccuracy : position.coords.accuracy});
    // To avoid conflict when calling this on callback function
    // replace component's "this" as self variable
    var self = this;
    window.setTimeout(function(){
      navigator.geolocation.getCurrentPosition(self.onLocationFound, self.onLocationError);
    }, 1000);

    // If the user is tracking the location, replace center of the map according to its location
    if(this.state.followingLocation){
      this.setState({center: [position.coords.latitude,position.coords.longitude]});
    }

    // Transmetting userLocation to global app as state
    self.props.setUserLocation([position.coords.latitude,position.coords.longitude], position.coords.accuracy);
    console.log([position.coords.latitude,position.coords.longitude]);

    // Check for each stop feature if the distance is smaller than 150m to render spot content
    stops.features.forEach(function(stop){
      // Store coordinates of each points as variable S
      var s = stop.geometry.coordinates;
      // Pythagore function - calculate distance betweeen location and every stop
      var d = Math.pow(Math.pow(s[0] - position.coords.latitude, 2) + Math.pow(s[1] - position.coords.longitude, 2), 0.5);
        // If distance, trigger showSpotContent function
        // NB default parameter for distance is 0.0002
        if(localStorage.getItem(('stop'+stop.properties.id))!='visited' && d < 0.0002){
          // On first visit of the stop, add stop number into local storage
          localStorage.setItem('stop'+stop.properties.id,'visited')
          // Triger function handling
          self.props.onStopReached(stop.properties.id);
        }
    })

    // Check for each questionStop feature if the distance is smaller than 150m to render questions
    questionStops.features.forEach(function(stop){
      // Store coordinates of each points as variable S
      var s = stop.geometry.coordinates;
      // Pythagore function - calculate distance betweeen location and every stop
      var d = Math.pow(Math.pow(s[0] - position.coords.latitude, 2) + Math.pow(s[1] - position.coords.longitude, 2), 0.5);
        // If distance, trigger question function
        // NB default parameter for distance is 0.0002
          if(d < 0.0002){
          // Actual stop number
          if(self.props.content == 'Carte'){
            self.props.checkUserData(indicatorsList[0])
          }
        }
    })
  }

  // Location error handling
  onLocationError = () => {
    var self = this;
    window.setTimeout(function(){
      navigator.geolocation.getCurrentPosition(self.onLocationFound, self.onLocationError);
    }, 1000);
  }

  // Updating center state as panning
  handlePan = (e) => {
    this.setState({center: e.target.getCenter()});
    this.setState({followingLocation : false});
    this.props.trackInteraction(e.target.getCenter(),'pan','panning map')
  }

  // Updating zoom state as zoomed
  handleZoom = (e) => {
    this.setState({zoom: e.target.getZoom()});
    this.setState({followingLocation : false});
    this.props.trackInteraction(e.target.getZoom(),'pan','zooming map')
  }

  // Focus on current location
  focusLocation = () => {
    this.setState({center : this.state.location});
    this.setState({zoom : 16});
    this.setState({followingLocation : true});
    this.props.trackInteraction(this.state.location,'click','center map')
  }

  // When the page is loaded, get user location
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
    // Avoir bug when loading stop content without any post value
    // In this case return to welcome page
    if(this.props.content == 'StopContent' && this.props.stop==null){
      localStorage.setItem('currentPage','Bienvenue')
      return(
        <Welcome showMap={this.props.showMap} trackInteraction={this.props.track}/>
      )
    } else {
      localStorage.setItem('currentPage',this.props.content)
      // Storing handleClick props into a variable for use into callback functions
      var self = this;
      // -------------------------------------------------- //
      // Rendering Welcome page
      if(this.props.content == 'Bienvenue'){
        return(
          <Welcome showMap={this.props.showMap} trackInteraction={this.props.track}/>
        )
      // -------------------------------------------------- //
      // Rendering Map page
      } else if (this.props.content == 'Carte'){

      var mapstyle = {
        height : `${(window.innerHeight-150)}px`
      }
      // trackComplete variable for storing track with correct coordinates
      var trackComplete = [];
      // Reversing latlng coordinates
      track.features.forEach(function(segment){
        if(mapShown == false){
          // forEach feature, reverse each point coordinates
          segment.geometry.coordinates.forEach(function(point){
            point.reverse();
          })
        }
        // Add reversed coordinates into trackComplete variable
        trackComplete.push(segment.geometry.coordinates);
      });

      return(
          <div ref='mymap'>
            {/* Map with initial parameters */}
            <Map id='map' ref='map' center={this.state.center} zoom={this.state.zoom} minZoom={13} maxZoom={20} maxBounds={[[46.47,6.53],[46.58,6.71]]}style={mapstyle}
              // Handling changed on focus when interacting with the map
              onDragend={this.handlePan} onZoomend={this.handleZoom}
              updateUserData={this.props.updateUserData} nextIndicator={this.props.nextIndicator}>
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
                return <Marker key={id} icon={myIcons[id-1]} value={id} position={coords} onClick={self.props.handleClick}/>
              })}
              <Marker icon={locationIcon} position={this.state.location}/>
              <Circle center={this.state.location} radius={this.state.locationAccuracy}/>
              <Control position='topright'>
                <button onClick={this.focusLocation}>Centrer</button>
              </Control>
            </Map>
            {mapShown = true}
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
      } else if(this.props.content == 'StopContent'){
        return(
          <StopContent
            // Passing user information
            userid = {this.props.userid}
            // Passing methods about changing pages and rendering
            showMap = {this.props.showMap} stop={this.props.stop} renderNavbar={this.props.renderNavbar}
            // Passing tarckingLog method
            trackInteraction={this.props.trackInteraction}
          />
        )
      // -------------------------------------------------- //
      // Rendering Questionnary page
      } else if(this.props.content == 'Questionnaire'){
        return (
          <Questionnary userid={this.state.userid} updateUserData={this.props.updateUserData} nextIndicator={this.props.nextIndicator}/>
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
      } else {
        return(
          <div>
            <h1>Oups, on dirait qu'il y a une erreur...</h1>
            <p>Si ce message subsiste, fermez votre navigateur et relancez votre navigateur pour rertourner sur le Géoguide.</p>
          </div>
        )
      }
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
      userLocation : [0,0],
      userLocationAccuracy : 0,
      // userLogged : true,
      // username : '1234',
      // userid : '-LFwqhkJbSc9luHRlK73',

      // Saving data on next indicator
      nextIndicator : '',
      // States about page content and rendering
      currentPage : localStorage.getItem('currentPage'),
      currentStop : null,
      renderNavbar : true,
    }
  }

  // When user identifies himself, set state and localStorage with entered values
  login = (username,userid) => {
    this.setState({username:username, userid:userid})
    // Set localStorage username and userid as entered
    localStorage.setItem('username',this.state.username)
    localStorage.setItem('userid',this.state.userid)
    // Check for first indicator in database
    // NB: check this part later
    // let initialIndicators = ['i11','i12','i13','i14']
    // var self = this;
    // initialIndicators.forEach(function(item){
    //   self.checkUserData(item);
    // })
    this.getArrayValues('i22')
    this.getArrayValues('i33')
    this.initializeNextIndicator()
    // Save this's comopnent as self variabel for callback function
    var self = this;

    // Check for next indicator, if the user has already completed part of the path
    setTimeout(function(){
      var nextIndicator = localStorage.getItem('nextIndicator');
      var firstQuestions = ['i11','i12','i13','i45']
      // If next indicator to be checked is still part of the first questions, check it
      if(firstQuestions.indexOf(nextIndicator) != -1){
        self.checkUserData(nextIndicator)
      } else {
        // If indicator does not have to be check on the beginning, go to map
        self.setState({currentPage : 'Carte'})
      }
    },1000)
    // In any case define user as logged in when finished
    this.setState({userLogged : true})
  }

  // Methods getting and setting user data into DB
  checkUserData = (indicator) => {
    let indicatorExists = ''
    database.ref('/users').once('value', snap => {
      indicatorExists = snap.child(this.state.userid).val()[indicator];
    }).then(() => {
      if(indicatorExists == 'undefined'){
        this.setState({'currentPage' : 'Questionnaire','renderNavbar':false})
      } else {
        this.setState({'currentPage' : 'Carte','renderNavbar':true,'mapShown' : true})
      }
    })
  }

  // Updating user data info DB
  // indicator corresponds to i11, i12 etc. values
  // value corresponds to the value linked to the specific indicator
  updateUserData = (indicator,value) => {
    // Saving this's Component into self variable for handling callback
    var self = this
    database.ref('/users').child(this.state.userid).update({
      [indicator] : value
    })
    // Get index of next indicator to be cheked into Indicator List
    var nextIndex = indicatorsList.indexOf(indicator) + 1
    // Get value of the corresponding indicator
    var nextIndicator = indicatorsList[nextIndex]
    // If next value is finished, go back to map
    if(nextIndicator == 'finished' || nextIndicator == 'firstlog'){
      if(nextIndicator == 'finished'){
        self.setState({'currentPage' : 'Carte','renderNavbar':true})
      } else {
        self.setState({'currentPage' : 'Bienvenue','renderNavbar':true})
      }
      nextQuestionStop++;
      getIndicatorsList(nextQuestionStop)
      self.setNexIndicator(indicatorsList[0])
      // Else, set next indicator as indicator to be checked
    } else {
      self.setNexIndicator(nextIndicator)
    }
  }

  // Getting nextIndicator to be set into dB when starting the app
  initializeNextIndicator = () => {
    var nextIndicator = '';
    database.ref('/users').once('value', snap => {
      nextIndicator = snap.child(this.state.userid).val().nextIndicator
    }).then(() => {
      // Save the nextIndicator into state and into localStorage
      this.setState({nextIndicator : nextIndicator})
      localStorage.setItem('nextIndicator',nextIndicator)
    })
  }

  // Setting nextIndicator to be set into dB
  setNexIndicator = (nextIndicator) => {
    database.ref('users').child(this.state.userid).update({
      'nextIndicator':nextIndicator
    }).then(() => {
      this.setState({nextIndicator : nextIndicator})
      localStorage.setItem('nextIndicator',nextIndicator)
    })
  }

  setUserLocation = (location, accuracy) => {
    this.setState({userLocation : location, userLocationAccuracy : accuracy})
  }

  // Setting up array to be saved into localStorage for indicator i22 and i33
  getArrayValues = (indicator) => {
    var firebaseArray = '';
    database.ref('/users').once('value', snap =>{
      firebaseArray = snap.child(this.state.userid).val()[indicator]
    }).then(() =>{
      localStorage.setItem(indicator,JSON.stringify(firebaseArray))
    })
  }

  // reload = () => {
  //   this.setState({currentPage : 'Bienvenue'})
  //   this.setState({currentStop : null})
  // }

  // Methods handling page changes and rendering
  showMap = () => {
    this.setState({currentPage : 'Carte'})
    this.setState({currentStop : null})
    this.trackInteraction('Carte','click','render map')
  }

  changePage = (e) => {
    this.setState({currentPage : e.target.innerHTML})
    this.setState({currentStop : null})
    this.trackInteraction(e.target.innerHTML,'click','change page')
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
    var markerStop = e.target.options.value
    // Verifiy is the stop is part of the content!
    if(markerStop < 6 || markerStop > 15){
      alert("Le contenu de ce poste n'est disponible que dans la version complète du Géoguide, dommage!")
    } else {
      this.setState({currentStop : e.target.options.value})
      this.setState({currentPage : 'StopContent'})
    }
    this.trackInteraction(markerStop,'click','clicked marker')
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
    this.trackInteraction(this.state.currentStop,'click','access stop content')
  }

  // Keep records of the user's interaction into firebase
  trackInteraction = (value,interaction,data) => {
    database.ref('/interactions').push({
      username : this.state.username,
      value : value,
      interaction : interaction,
      data : data,
      location : this.state.userLocation,
      locationAccuracy : this.state.userLocationAccuracy,
      time : Date(),
      windowSize : [window.innerHeight,window.innerWidth]
    })
  }

  componentDidMount = () => {
    // Adding eventListener for scrolling
    // var scroll;
    // var self = this;
    //
    // window.addEventListener('scroll',function(e){
    //   scroll = e.path[1].scrollY;
    //   self.trackInteraction(scroll,'scroll','scrolling page')
    // })
    // // Checking if the page has username data
    if(localStorage.getItem('username') == 'null'){
      this.setState({userLogged : false})
    }
  }

  render() {
    // console.log(this.state.userid);
    var headerStyle = {
      width : window.innerWidth
    }
    // Storing navbar into variable, completed only if page content is not a quiz
    var navbar = '';
    if(this.state.renderNavbar){
      navbar = <Navbar itemList = {optionsArray} onClick = {this.changePage}/>
    }

    // If user data is found into localStorage
    if(this.state.userLogged){
      return(
        <div className="App">
          <header>Géoguide Lausanne</header>
          <p className="username">Connecté en tant que {this.state.username}</p>
          <PageContent
            // Passing information about user
            userid={this.state.userid} username={this.state.username}
            // Passing methods on handling interaction between user data and database
            updateUserData={this.updateUserData} nextIndicator={this.state.nextIndicator} checkUserData={this.checkUserData} setUserLocation={this.setUserLocation}
            // Pasing methods about changing pages and rendering
            showMap={this.showMap} content={this.state.currentPage} onClick={this.showSpotContent}renderNavbar ={this.renderNavbar} reload={this.reload}
            // Passing methods about map
            handleClick={this.handleMarkerClick} stop={this.state.currentStop} onStopReached={this.showSpotContent} trackInteraction={this.trackInteraction}
          />
          {/* Navbar component showing only if page is not a quiz */}
          {navbar}
        </div>
      )
    // If no user data is found into localStorage
    } else {
      return (
        <div className="App">
          <header>Géoguide Lausanne</header>
          <Login trackInteraction={this.trackInteraction} onClick={this.login}/>
        </div>
      )
    }
  }
}

export default Geoguide;
