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

let initialIndicators = ['i11','i12','i13','i14','i31']

// Setting a reference to the database service
var database = firebase.database();

class Questionnary extends Component {
  constructor(props){
    super(props);
    this.state = {
      nextIndicator : 'i11'
    }
  }

  getNextIndicator = () => {
    var nextindIcator = database.ref('/users').once('value', snap => {
      snap.child(this.props.userid).val().nextIndicator
    })
    this.setState({nextIndicator : nextindIcator})
  }

  render() {
    let introduction;
    // Check if the
    if(initialIndicators.indexOf(this.state.nextIndicator) != -1){
      introduction = <h2>Avant de commencer, nous souhaiterions vous demander quelques informations</h2>
    }
    return (
      <div>
        {introduction}
        <h2>Page de questionnaire</h2>
      </div>
    )
  }
}

export default Questionnary;
