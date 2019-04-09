import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import axios from 'axios'
import Home from './Home'
import Event from './Event'
import Series from './Series'
import Colors from './Colors'
import { Provider } from 'mobx-react'
import PromoterStore from './stores/promoter'
import EventStore, { eventStore } from './stores/event'
import RaceStore, { raceStore } from './stores/race'
import RiderStore from './stores/rider'
import SeriesStore, { seriesStore } from './stores/series'
import BibStore from './stores/bib'
import PassingStore from './stores/passing'
import Race from './Race'
import throttle from 'lodash.throttle'

axios.defaults.baseURL = 'https://api.critrace.com'
// axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.headers['content-type'] = 'application/json'

Object.assign(document.body.style, {
  margin: 'auto',
  'font-family': 'Helvetica',
  'background-color': Colors.whiteDark,
  minHeight: window.innerHeight,
})

const stores = {
  promoter: new PromoterStore(),
  event: eventStore,
  race: raceStore,
  rider: new RiderStore(),
  series: seriesStore,
  bib: new BibStore(),
  passing: new PassingStore(),
}

const appDiv = document.getElementById('app')
const setAppStyle = () => {
  appDiv.setAttribute(
    'style',
    `
min-height: ${window.innerHeight}px;
display: flex;
flex-direction: column;
`
  )
}
window.addEventListener('resize', throttle(setAppStyle, 250))
setAppStyle()

ReactDOM.render(
  <Provider {...stores}>
    <Router>
      <Route path="/" component={Home} exact />
      <Route path="/event/:id" component={Event} />
      <Route path="/series/:id" component={Series} />
      <Route path="/race/:id" component={Race} />
    </Router>
  </Provider>,
  appDiv
)
