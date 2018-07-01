import React, { Component } from 'react';
import {Forms, Buttons} from 'react-bootstrap';
import * as firebase from 'firebase';

// Firebase configuration and initialization
var config = {
  apiKey: "AIzaSyDA9_FYCQfJKbyE_-V5tPB0Wdzv9pP3-2w",
  authDomain: "geoguide-react.firebaseapp.com",
  databaseURL: "https://geoguide-react.firebaseio.com",
  projectId: "geoguide-react",
  storageBucket: "",
  messagingSenderId: "920767176331"
};

firebase.initializeApp(config);

// Setting a reference to the database service
var database = firebase.database();

// Class Login as main component for login page
class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      // Contains username
      username:null,
      // Boolean if username is valid
      validName:false,
      // Boolean for cleaning the input on first focus and displaying page status
      focusedInput:false
    }
  }

  checkingDb = () => {
    // database.ref() gets to db root
    // once triggers event once on value change
    // snap is a snapShot of the databse at this point
    database.ref('/users').once('value', snap => {
      snap.forEach(childSnapshot => {
        // Checking 'username' value of the child of 'users'
        var usernameList = childSnapshot.child('/username').val();
        // Checking for matching values into the db
        if(usernameList == this.state.username){
          this.setState({validName:false})
        } else
        if(this.state.username == ''){
          this.setState({focusedInput:false})
        }
      })
    });
  }

  // Clears input on first focus
  handleFocus = (e) => {
    if(this.state.focusedInput == false){
      e.target.value = ''
    }
  }

  // Updates username value and checks if it already exists in db
  handleChange = (e) => {
    this.setState({username:e.target.value, validName:true, focusedInput:true})
    this.checkingDb()
  }

  handleClick = () => {
    // NB: for the moment i31 & i32 are defined because the questions have not been created yet
    // If username doesn't exist in db
    if(this.state.validName){
      // Pushing new username into db - Store it into a variable
      var newUser = database.ref('/users').push({
        username:this.state.username,
        i11 : 'undefined',
        i12 : 'undefined',
        i13 : 'undefined',
        i14 : 'undefined',
        i15 : 'undefined',
        i16 : 'undefined',
        i17 : 'undefined',
        i18 : 'undefined',
        i19 : 'undefined',
        i21 : 'undefined',
        i22 : [0,0,0,0,0,0,0,0,0,0],
        i23 : 'undefined',
        i24 : 'undefined',
        i25 : 'undefined',
        i311 : 'undefined',
        i312 : 'undefined',
        i313 : 'undefined',
        i315 : 'undefined',
        i321 : 'undefined',
        i322 : 'undefined',
        i323 : 'undefined',
        i325 : 'undefined',
        i33 : [0,0,0,0,0,0,0,0,0,0],
        i411 : 'undefined',
        i412 : 'undefined',
        i413 : 'undefined',
        i42 : 'undefined',
        i43 : 'undefined',
        i44 : 'undefined',
        i45 : 'undefined',
        nextIndicator : 'i11',
      });
      // Triggers login function inherited from Geoguide Component
      this.props.onClick(this.state.username,newUser.key);
    // If username already exsists in db
    } else {
      // database.ref() gets to db root
      // once triggers event once on value change
      // snap is a snapShot of the databse at this point
      database.ref('/users').once('value', snap => {
        snap.forEach(childSnapshot => {
          var usernameList = childSnapshot.child('/username').val();
          if (usernameList == this.state.username){
            this.props.onClick(this.state.username,childSnapshot.key)
          }
        })
      })
    }
  }

  render(){
    // Condiditionnal rendering for user entry
    var validation;
    var inputStyling;
    // check if user has focused and name input isn't empty
    if(this.state.focusedInput && this.state.username != null){
      if (this.state.validName == true){
        // show username as valid
        validation = <p className="login">Ce nom d'utilisateur est disponible</p>
      } else {
        // show username as invalid
        validation = <p className="login">Ce nom d'utilisateur existe déjà,<br />êtes vous sûr que c'est bien vous?</p>
        inputStyling = {backgroundColor:'red'};
      }
    }

    return (
      <div>
        <h1 className="login">Bienvenue dans le Géoguide Lausanne</h1>
        <p className="login">Avant de commencer, veuillez vous connecter avec votre nom d'utilisateur</p>
        <input className="login" type="text" required = "true" defaultValue = "Entrez votre nom"
          style = {inputStyling}
          onChange = {this.handleChange} onFocus = {this.handleFocus}>
        </input>
        <button onClick = {this.handleClick}>
          Login
        </button><br />
        {validation}
      </div>
    )
  }
}

export default Login;
