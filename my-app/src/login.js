import React, { Component } from 'react';
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

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      // Contains username
      userid:null,
      // Boolean if username is valid
      existingName:false,
      // Boolean for cleaning the on first focus
      focusedInput:false,
    }
  }

  checkingDb = () => {
    database.ref('/users').once('value', snap => {
      snap.forEach(childSnapshot => {
        var usernameList = childSnapshot.child('/username').val();
        if(usernameList == this.state.userid){
          this.setState({existingName:false})
        }
      })
    });
  }

  handleFocus = (e) => {
    if(this.state.focusedInput == false){
    e.target.value = '';
    this.setState({focusedInput:true})
    }
  }

  handleChange = (e) => {
    this.setState({userid:e.target.value, existingName:true})
    this.checkingDb()
    if(this.state.userid == ''){

    }
  }

  handleClick = () => {
    if(this.state.existingName){
      database.ref('/users').push({
        username:this.state.userid
      });
      this.props.onClick();
    } else {
      alert("HEHO");
    }
  }

  render(){
    // Condiditionnal rendering for user entry
    var validation;
    if(this.state.focusedInput && this.state.userid != null){
      console.log(this.state.userid);
      validation = this.state.existingName ? (
        <span>Ce nom d'utilisateur est disponible</span>
      ) : (
        <span>Ce nom d'utilisateur existe déjà</span>
      );
    }

    return (
      <div>
        <h2>Bienvenue dans le Géoguide Lausanne</h2>
        <span>Avant de commencer il faut créer un nom d'utilisateur</span>
        <input type="text" required = "true" defaultValue = "Entrez votre nom"
          onChange = {this.handleChange} onFocus = {this.handleFocus}>
        </input>
        <button onClick = {this.handleClick}>
          Login
        </button>
        {validation}
      </div>
    )
  }


export default Login;
