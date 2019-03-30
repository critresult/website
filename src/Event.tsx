import React from 'react'
import { inject, observer } from 'mobx-react'
import { VFlex, HFlex, ModalContainer, Input, LargeText } from './components/Shared'
import Header from './components/Header'
import EventStore, { Event } from './stores/event'
import RaceStore, { Race } from './stores/race'
import styled from 'styled-components'
import moment from 'moment'
import Popup from './components/Popup'
import Button from './components/Button'
import RaceCreate from './components/RaceCreate'
import Colors from './Colors'
import { withRouter } from 'react-router-dom'
import Entrylist from './components/Entrylist'

@inject('promoter', 'event', 'race')
@observer
class _Event extends React.Component<{
  event: EventStore
  race: RaceStore
  match: any
}> {
  state = {
    raceCreateVisible: false,
  }

  componentDidMount() {
    const eventId = this.props.match.params.id
    this.props.event.load(eventId)
    this.props.race.loadByEventId(eventId)
  }

  render() {
    const eventId = this.props.match.params.id
    const event = this.props.event.eventsById[eventId] || ({} as Event)
    const races = event.races || []
    const dateFormat = 'MMMM Do YYYY'
    const dayDifference = moment(event.startDate)
      .utc()
      .fromNow()
    return (
      <>
        <Header />
        <Popup visible={this.state.raceCreateVisible}>
          <RaceCreate
            eventId={eventId}
            onCreated={() => {
              this.setState({ raceCreateVisible: false })
            }}
            onCancelled={() => this.setState({ raceCreateVisible: false })}
          />
        </Popup>
        <VFlex>
          <VFlex style={{ alignItems: 'flex-start' }}>
            <LargeText>
              {(event.series || {}).name} - {event.name}
            </LargeText>
          </VFlex>
          <VFlex style={{ alignItems: 'flex-end' }}>
            <LargeText>
              {moment(event.startDate)
                .utc()
                .format(dateFormat)}{' '}
              ({dayDifference})
            </LargeText>
            {event.startDate === event.endDate ? null : (
              <LargeText>Event End: {event.endDate}</LargeText>
            )}
          </VFlex>
          {races.map((race: Race) => (
            <Entrylist key={race._id} raceId={race._id} />
          ))}
          <HFlex>
            <Button
              title="Add Race"
              onClick={() => this.setState({ raceCreateVisible: true })}
            />
            <Button
              title="Delete Event"
              onClick={() => {
                if (!confirm('Delete this event?')) return
                return this.props.event
                  .delete(eventId)
                  .then(() => this.props.event.loadUpcoming())
                  .then(() => this.props.history.push('/'))
              }}
              style={{ backgroundColor: Colors.pink }}
            />
          </HFlex>
        </VFlex>
      </>
    )
  }
}

export default withRouter(_Event)
