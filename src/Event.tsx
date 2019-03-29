import React from 'react'
import { inject, observer } from 'mobx-react'
import { VFlex, HFlex } from './components/Shared'
import Header from './components/Header'
import EventStore from './stores/event'

@inject('promoter', 'event')
@observer
class Event extends React.Component<{
  event: EventStore
  match: any
}> {
  componentDidMount() {
    this.props.event.load(this.props.match.params.id)
  }
  render() {
    const eventId = this.props.match.params.id
    const event = this.props.event.eventsById[eventId] || {}
    return (
      <>
        <Header />
        <div style={{ fontSize: 20, margin: 8 }}>
          Event ID: {this.props.match.params.id}
        </div>
        <div style={{ fontSize: 20, margin: 8 }}>Event Name: {event.name}</div>
        <div style={{ fontSize: 20, margin: 8 }}>
          Event Start: {event.startDate}
        </div>
        <div style={{ fontSize: 20, margin: 8 }}>
          Event End: {event.endDate}
        </div>
      </>
    )
  }
}

export default Event
