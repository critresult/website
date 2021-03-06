import React from 'react'
import { inject, observer } from 'mobx-react'
import {
  VFlex,
  HFlex,
  LargeText,
  RootCell,
  TitleText,
} from './components/Shared'
import Header from './components/Header'
import EventStore, { Event } from './stores/event'
import RaceStore, { Race } from './stores/race'
import { Entry } from './stores/entry'
import SeriesStore from './stores/series'
import moment from 'moment'
import Popup from './components/Popup'
import Button from './components/Button'
import RaceCreate from './components/RaceCreate'
import Colors from './Colors'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Entrylist from './components/Entrylist'
import Footer from './components/Footer'
import idx from 'idx'
import AvailableBibs from './components/AvailableBibs'
import uniqby from 'lodash.uniqby'
import LoadingIndicator from './components/LoadingIndicator'

@(withRouter as any)
@inject('promoter', 'event', 'race', 'series')
@observer
export default class _Event extends React.Component<
  RouteComponentProps & {
    event: EventStore
    race: RaceStore
    series: SeriesStore
    match: any
  }
> {
  state = {
    raceCreateVisible: false,
    loading: true,
  }

  async componentDidMount() {
    this.componentDidUpdate({})
  }

  componentDidUpdate(prevProps: any) {
    const eventId = this.props.match.params.id
    const lastEventId = idx(prevProps, (_: any) => _.match.params.id)
    if (eventId === lastEventId) return
    this.setState({ loading: true })
    this.props.event
      .load(eventId)
      .then(() => {
        const { seriesId } = this.props.event.eventsById(eventId)
        return this.props.series.load(seriesId)
      })
      .then(() => this.setState({ loading: false }))
      .catch((err) => {
        this.setState({ loading: false })
        throw err
      })
  }

  render() {
    const eventId = this.props.match.params.id
    const event = this.props.event.eventsById(eventId)
    const series = this.props.series.seriesById(event.seriesId)
    const races = event.races || []
    const allEntries = [] as Entry[]
    races.forEach((race) => {
      const entries = this.props.race.entriesByRaceId(race._id)
      allEntries.push(...entries)
    })
    const uniqRidersLength = uniqby(allEntries, 'riderId').length
    const startTime = moment(event.startDate)
    const hours = races.length
      ? idx(races, (_: any) => _[0].scheduledStartTime.split(':')[0])
      : 0
    startTime.add(hours as number | string, 'h')
    const dayDifference = startTime.fromNow()
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
        {this.state.loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <RootCell
              style={{
                marginTop: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
            >
              <VFlex>
                <TitleText>
                  {series.name} - {event.name} - {uniqRidersLength} Riders
                </TitleText>
                <LargeText>
                  {moment(event.startDate)
                    .utc()
                    .format('MMMM Do YYYY')}{' '}
                  ({dayDifference})
                </LargeText>
                {event.startDate === event.endDate ? null : (
                  <LargeText>Event End: {event.endDate}</LargeText>
                )}
              </VFlex>
            </RootCell>
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
                      .then(() => this.props.event.loadHome())
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
          </>
        )}
        <Footer />
      </>
    )
  }
}
