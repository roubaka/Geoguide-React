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

// Setting a reference to the database service
var database = firebase.database();

class Questionnary extends Component {
  constructor(props){
    super(props);
    this.state = {
      userid : localStorage.getItem('userid'),
      indexOfIndicator : 0,
      slidersArray : [1,1,1,1,1]
    }
  }

  handleChange = (e) => {
    // Saving slider values into component state
    let index = e.target.attributes.keyvalue.value - 1;
    let value = e.target.value
    let updatedArray = this.state.slidersArray;
    // Setting selected value to corresponding index
    updatedArray[index] = value
    // Replace updated array into component state
    this.setState({slidersArray : updatedArray})
  }

  updateIndex = () => {
    // Saving this's Component into self variable for handling callback
    var self = this;
    if(localStorage.getItem('nextIndicator') != 'finished'){
      questionnaries.forEach(function(item){
        if(item.indicator == localStorage.getItem('nextIndicator')){
          self.setState({indexOfIndicator : questionnaries.indexOf(item)})
          console.log(self.props.nextIndicator);
          return
        }
      })
    }
  }

  componentDidMount(){
    // Saving this's Component into self variable for handling callback
    var self = this;
    // Iterating through the whole array of indicators in questionnaries
    questionnaries.forEach(function(item){
      // If the nextIndicator, get current index
      if(item.indicator == localStorage.getItem('nextIndicator')){
        self.setState({indexOfIndicator : questionnaries.indexOf(item)})
        return
      }
    })
  }

  render() {
    // Saving this's Component into self variable for handling callback
    var self = this;

    // nextOne = object corresponding to the current indicator to be set
    var nextOne = questionnaries[this.state.indexOfIndicator];
    // Elements to be placed into the page
    var title = nextOne.title
    var question = nextOne.question
    // Different option values for the indicator
    var options = []
    // Optional button quit for slider questionnary
    var quitButton = ''

    // adding image component for picture recognition quesions
    var img;
    if(nextOne.img){
      img =
      <div>
        <img src = {require(`../img/${nextOne.img}`)} width = {'auto'} height = {'auto'}/><br/>
      </div>
    }

    // Iterating through values - maximum 5 options
    for (var i = 1; i < 6; i++){
      // Related indicator to be set
      let indicator = nextOne.indicator
      // Variable containing specified option
      let option = `option${i}`
      // Value of the specific option
      let optionValue = nextOne[option]
      // Only add option if field is not empty
      if(nextOne[option] != ''){
        // Rendering buttons
        if(nextOne.type == 'unique'){
          options.push(
            <button key = {i} onClick = {function(){
              self.props.updateUserData(indicator, optionValue)
              setTimeout(function(){
                self.updateIndex()
              },500)
            }}>{optionValue}
          </button>,
          <br key={i+5}/>
        )
        // Rendering sliders
        } else {
          options.push(
            <div key={i}>
              <h5>{optionValue}</h5>
              <h5>{this.state.slidersArray[i-1] ? this.state.slidersArray[i-1] : 1}</h5>
              <input keyvalue={i} className='range' type='range' min='1' max={5} step={1}
                defaultValue={1} onChange={this.handleChange}>
              </input>
            </div>
          )
          // Button pushing values into dB
          quitButton = <button onClick={function(){
              self.props.updateUserData(indicator, self.state.slidersArray)
              setTimeout(function(){
                self.updateIndex()
              },500)
            }}>Poursuivre</button>
        }
      }
    }

    return (
      <div>
        <h3>{title}</h3>
        <h2>{question}</h2>
        {img}
        {options}
        <br/>
        {quitButton}
      </div>
    )
  }
}

export default Questionnary;
