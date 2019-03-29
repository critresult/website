import React from 'react'
import { VFlex, HFlex } from './components/Shared'
import Header from './components/Header'
import { inject, observer } from 'mobx-react'
import EventCell from './components/EventCell'
import EventStore from './stores/event'

@inject('promoter', 'event')
@observer
class Home extends React.Component<{
  event?: EventStore
}> {
  componentDidMount() {
    this.props.event.loadUpcoming()
  }

  render() {
    return (
      <>
        <Header />
        <div
          style={{
            padding: 20,
            margin: 'auto',
            maxWidth: 900,
          }}
        >
          Upcoming Events:
          {this.props.event.upcomingEvents.map((event) => (
            <div>{event.name}</div>
          ))}
        </div>
      </>
    )
  }
}

export default Home
