import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import axios from 'axios'
import Home from './Home'
import Event from './Event'
import Colors from './Colors'
import { Provider } from 'mobx-react'
import PromoterStore from './stores/promoter'
import EventStore from './stores/event'

axios.defaults.baseURL = 'https://api.critresult.com'
// axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.headers['content-type'] = 'application/json'

Object.assign(document.body.style, {
  margin: 'auto',
  'font-family': 'Helvetica',
  'background-color': Colors.white,
})

const stores = {
  promoter: new PromoterStore(),
  event: new EventStore(),
}

ReactDOM.render(
  <Provider {...stores}>
    <Router>
      <Route path="/" component={Home} exact />
      <Route path="/event/:id" component={Event} />
    </Router>
  </Provider>,
  document.getElementById('app')
)
