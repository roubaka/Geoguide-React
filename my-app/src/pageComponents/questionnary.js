import React, { Component } from 'react';
import {Forms, Buttons} from 'react-bootstrap';
import * as firebase from 'firebase';

import questionnaries from './../data/questionnaries.js';

// Firebase configuration and initialization
var config = {
  apiKey: "AIzaSyDA9_FYCQfJKbyE_-V5tPB0Wdzv9pP3-2w",
  authDomain: "geoguide-react.firebaseapp.com",
  databaseURL: "https://geoguide-react.firebaseio.com",
  projectId: "geoguide-react",
  storageBucket: "",
  messagingSenderId: "920767176331"
};


let initialIndicators = ['i11','i12','i13','i14','i31'];

// Setting a reference to the database service
var database = firebase.database();

class Questionnary extends Component {
  constructor(props){
    super(props);
    this.state = {
      nextIndicator : 'i11',
      userid : localStorage.getItem('userid')
    }
  }

  setNextIndicator = () => {
    console.log(this.state.userid);

    var nextIndicator = '';
    database.ref('/users').once('value', snap => {
      nextIndicator = snap.child(this.state.userid).val().nextIndicator
    }).then(() => {
      // console.log(nextIndicator);
      this.setState({nextIndicator : nextIndicator})
    })
  }

  componentDidMount(){
    this.setNextIndicator()
  }

  render() {
    console.log(questionnaries[0].indicateur == this.state.nextIndicator);

    return (
      <div>
        <h2></h2>
        <h2></h2>
      </div>
    )
  }
}

export default Questionnary;
