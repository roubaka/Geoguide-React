import React from 'react';
import ReactDOM from 'react-dom';
import Geoguide from './Geoguide';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Geoguide />, div);
  ReactDOM.unmountComponentAtNode(div);
});
