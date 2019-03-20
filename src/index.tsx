import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';

Object.assign(document.body.style, {
  'margin': 'auto',
  'font-family': 'Helvetica',
});

ReactDOM.render(
  <Router>
    <Route path="/" component={Home} exact />
  </Router>,
  document.getElementById('app')
);
