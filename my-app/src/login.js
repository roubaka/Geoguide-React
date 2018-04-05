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
      userid:null,
      validName:false,
      focusedInput:false,
    }
  }

  checkingDb = () => {
    var maxi = this.validateName
    var userTyping = this.state.userid;
    var nameIsValid = true;
    database.ref('/users').once('value', snap => {
      snap.forEach(childSnapshot => {
        var usernameList = childSnapshot.child('/username').val();
        if(usernameList == userTyping){
          console.log('already existing ID');
          nameIsValid = false;
          this.setState({validName:nameIsValid})
        }
      })
    });
  }

  handleFocus = (e) => {
    e.target.value = '';
  }

  handleMouseOut = () => {
    this.setState({validName:this.checkingDb()})
  }

  handleChange = (e) => {
    this.setState({userid:e.target.value, focusedInput:true, validName:true})
  }

  validateName = (nameIsValid) => {
    this.setState({validName:nameIsValid})
    console.log(nameIsValid);
  }

  handleClick = () => {
    if(this.state.validName){
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
    if(this.state.focusedInput){
      var validation = this.state.validName ? (
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
          onChange = {this.handleChange} onFocus = {this.handleFocus} onMouseOut = {this.handleMouseOut}>
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
