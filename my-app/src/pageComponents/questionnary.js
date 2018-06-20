import React, { Component } from 'react';
import {Forms, Buttons} from 'react-bootstrap';
import * as firebase from 'firebase';

class Questionnary extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <h1>Ceci est une page pour poser des questions à l'utilisateur yay!</h1>
    )
  }
}

export default Questionnary;
