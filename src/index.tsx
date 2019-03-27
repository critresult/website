import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import CreateEvent from './CreateEvent';
import Colors from './Colors';

Object.assign(document.body.style, {
  'margin': 'auto',
  'font-family': 'Helvetica',
  'background-color': Colors.white,
});

ReactDOM.render(
  <Router>
    <Route path="/" component={Home} exact />
    <Route path="/event/create" component={CreateEvent} />
  </Router>,
  document.getElementById('app')
);
