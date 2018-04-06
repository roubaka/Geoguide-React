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
      username:null,
      // Boolean if username is valid
      validName:false,
      // Boolean for cleaning the on first focus and displaying page status
      focusedInput:false
    }
  }

  checkingDb = () => {
    database.ref('/users').once('value', snap => {
      snap.forEach(childSnapshot => {
        var usernameList = childSnapshot.child('/username').val();
        if(usernameList == this.state.username){
          this.setState({validName:false})
        } else
        if(this.state.username == ''){
          this.setState({focusedInput:false})
        }
      })
    });
  }

  handleFocus = (e) => {
    if(this.state.focusedInput == false){
    e.target.value = ''
    }
  }

  handleChange = (e) => {
    this.setState({username:e.target.value, validName:true, focusedInput:true})
    this.checkingDb()
  }

  handleClick = () => {
    if(this.state.validName){
      // Pushing new username into db - Store it into a variable
      var newUser = database.ref('/users').push({
        username:this.state.username
      });
      // Triggers login function inherited from Geoguide Component
      this.props.onClick(this.state.username,newUser.key);
    } else {
      alert("Ce nom d'utilisateur existe déjà, est-ce bien toi?");
    }
  }

  render(){
    // Condiditionnal rendering for user entry
    var validation;
    var style;
    if(this.state.focusedInput && this.state.username != null){
      if (this.state.validName == true)
      validation = <span>Ce nom d'utilisateur est disponible</span>
      ) : (
        <span>Ce nom d'utilisateur existe déjà</span>
      );
    }

    return (
      <div>
        <h2>Bienvenue dans le Géoguide Lausanne</h2>
        <span>Avant de commencer il faut créer un nom d'utilisateur</span>
        <input type="text" required = "true" defaultValue = "Entrez votre nom"
          style = {style}
          onChange = {this.handleChange} onFocus = {this.handleFocus}>
        </input>
        <button onClick = {this.handleClick}>
          Login
        </button>
        {validation}
      </div>
    )
  }
}

export default Login;
