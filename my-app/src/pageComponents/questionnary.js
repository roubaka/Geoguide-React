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
      userid : localStorage.getItem('userid')
    }
  }

  render() {


    // Elements to be placed into the map
    var title = questionnaries[0].title
    var question = questionnaries[0].question
    var options = []

    // Iterating
    for (var i = 1; i < 6; i++){
      // Saving this's Component into self variable for handling callback
      var self = this;
      // Related indicator to be set
      let indicator = questionnaries[0].indicator
      // Variable containing specified option
      let option = `option${i}`
      // Value of the specific option
      let optionValue = questionnaries[0][option]
      if(questionnaries[0][option] != ''){
        options.push(
          <button key = {i} onClick = {function(){
            // self.props.setNexIndicator()
            self.props.updateUserData(indicator, optionValue)
          }}>{optionValue}
          </button>,
          <br/>
        )
      }
    }


    return (
      <div>
        <h3>{title}</h3>
        <h2>{question}</h2>
        {options}
      </div>
    )
  }
}

export default Questionnary;
