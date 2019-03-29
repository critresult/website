import React from 'react'
import { inject, observer } from 'mobx-react'
import { VFlex, HFlex } from './components/Shared'
import Header from './components/Header'
import EventStore, { Event } from './stores/event'
import RaceStore from './stores/race'
import styled from 'styled-components'
import moment from 'moment'

const LargeText = styled.div`
  font-size: 20px;
  margin: 8px;
`

@inject('promoter', 'event', 'race')
@observer
class _Event extends React.Component<{
  event: EventStore
  race: RaceStore
  match: any
}> {
  componentDidMount() {
    this.props.event.load(this.props.match.params.id)
  }

  render() {
    const eventId = this.props.match.params.id
    const event = this.props.event.eventsById[eventId] || ({} as Event)
    const dateFormat = 'MMMM Do YYYY'
    const dayDifference = moment(event.startDate).fromNow()
    return (
      <>
        <Header />
        <LargeText>Event Name: {event.name}</LargeText>
        <LargeText>
          Event Start: {moment(event.startDate).format(dateFormat)} (
          {dayDifference})
        </LargeText>
        {event.startDate === event.endDate ? null : (
          <LargeText>Event End: {event.endDate}</LargeText>
        )}
        <LargeText>{(event.races || []).length} Races</LargeText>
        <div
          style={{
            margin: 8,
            padding: 8,
            borderRadius: 10,
            backgroundColor: 'white',
          }}
        >
          Race X
        </div>
      </>
    )
  }
}

export default _Event
