import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './Home'
import CreateEvent from './CreateEvent'
import Colors from './Colors'
import { Provider } from 'mobx-react'
import PromoterStore from './stores/promoter'
import axios from 'axios'

axios.defaults.baseURL = 'https://api.critresult.com'
axios.defaults.headers['content-type'] = 'application/json'

Object.assign(document.body.style, {
  margin: 'auto',
  'font-family': 'Helvetica',
  'background-color': Colors.white,
})

const stores = {
  promoter: new PromoterStore(),
}

ReactDOM.render(
  <Provider {...stores}>
    <Router>
      <Route path="/" component={Home} exact />
      <Route path="/event/create" component={CreateEvent} />
    </Router>
  </Provider>,
  document.getElementById('app')
)
