import React from 'react'
import { inject, observer } from 'mobx-react'
import {
  VFlex,
  HFlex,
  ModalContainer,
  Input,
  LargeText,
  RootCell,
} from './components/Shared'
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
import idx from 'idx'
import Footer from './components/Footer'
import Hydrated from './stores/hydrated'

@inject('promoter', 'event', 'race', 'series')
@observer
class _Event extends React.Component<{
  event: EventStore
  race: RaceStore
  match: any
}> {
  state = {
    raceCreateVisible: false,
  }

  async componentDidMount() {
    await Hydrated.hydrate()
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
          <LargeText>
            {(event.series || {}).name} - {event.name}
          </LargeText>
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
        <RootCell>
          <HFlex style={{ justifyContent: 'space-around' }}>
            <Button
              title="Delete Event"
              onClick={() => {
                if (
                  !confirm(
                    'Are you sure? This will delete all associated races and entries.'
                  )
                ) return
                return this.props.event
                  .delete(eventId)
                  .then(() => this.props.event.loadUpcoming())
                  .then(() => this.props.history.push('/'))
              }}
              style={{ backgroundColor: Colors.pink }}
            />
            <Button
              title="Add Race"
              style={{ backgroundColor: Colors.green }}
              onClick={() => this.setState({ raceCreateVisible: true })}
            />
          </HFlex>
        </RootCell>
        {races.map((race: Race) => (
          <RootCell key={race._id}>
            <Entrylist seriesId={race.seriesId} raceId={race._id} />
          </RootCell>
        ))}
        <Footer />
      </>
    )
  }
}

export default withRouter(_Event)
