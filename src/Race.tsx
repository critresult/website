import React from 'react'
import { inject, observer } from 'mobx-react'
import PromoterStore from './stores/promoter'
import PassingStore from './stores/passing'
import {
  RootCell,
  LargeText,
  VFlex,
  HFlex,
  TitleText,
} from './components/Shared'
import Header from './components/Header'
import Footer from './components/Footer'
import RaceStore from './stores/race'
import SeriesStore from './stores/series'
import EventStore from './stores/event'
import RiderStore from './stores/rider'
import moment from 'moment'
import Colors from './Colors'
import Button from './components/Button'
import { Link } from 'react-router-dom'

@inject('rider', 'promoter', 'passing', 'race', 'series', 'event')
@observer
export default class RaceScreen extends React.Component<{
  promoter: PromoterStore
  passing: PassingStore
  race: RaceStore
  series: SeriesStore
  event: EventStore
  rider: RiderStore
  match: any
}> {
  reloadTimer: any

  async componentDidMount() {
    await this.loadResultData()
  }

  componentDidUpdate(prevProps: any) {
    const raceId = this.props.match.params.id
    const lastRaceId = prevProps.match.params.id
    if (raceId === lastRaceId) return
    clearInterval(this.reloadTimer)
    this.reloadTimer = undefined
    this.loadResultData()
  }

  componentWillUnmount() {
    clearInterval(this.reloadTimer)
    this.reloadTimer = undefined
  }

  loadResultData = async () => {
    const raceId = this.props.match.params.id
    await Promise.all([
      this.props.passing.loadByRaceId(raceId),
      this.props.race.load(raceId),
      this.props.race.loadLeaderboard(raceId),
    ])
    const race = this.props.race.racesById(raceId)
    const leaderboard = this.props.race.leaderboardByRaceId(raceId)
    await Promise.all([
      this.props.series.load(race.seriesId),
      this.props.event.load(race.eventId),
      this.props.race.loadByEventId(race.eventId),
      ...leaderboard.map((passing) => this.props.rider.load(passing.riderId)),
    ])
    this.reloadTimer = setInterval(
      () => this.props.race.loadLeaderboard(raceId),
      5000
    )
  }

  render() {
    const raceId = this.props.match.params.id
    const race = this.props.race.racesById(raceId)
    const series = this.props.series.seriesById(race.seriesId)
    const event = this.props.event.eventsById(race.eventId)
    const leaderboard = this.props.race.leaderboardByRaceId(raceId)
    const otherRaces = this.props.race.racesByEventId(race.eventId)
    return (
      <>
        <Header />
        <RootCell
          style={{
            marginTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <VFlex>
            <TitleText>
              {series.name} - {event.name} - {race.name}
            </TitleText>
            {event.startDate === event.endDate ? null : (
              <LargeText>Event End: {event.endDate}</LargeText>
            )}
          </VFlex>
          <VFlex>
            <HFlex>
              {otherRaces.map((race) => (
                <Link
                  key={race._id}
                  to={`/race/${race._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    title={race.name}
                    style={{
                      backgroundColor:
                        race._id === raceId ? Colors.blue : Colors.black,
                    }}
                  />
                </Link>
              ))}
            </HFlex>
          </VFlex>
        </RootCell>
        {race.actualStart ? (
          <RootCell>
            <HFlex style={{ justifyContent: 'space-between' }}>
              <LargeText>
                {moment(race.actualStart).format('HH:mm:ss')} start -{' '}
                {race.lapCount} laps
              </LargeText>
            </HFlex>
            {leaderboard.map((passing, index) => {
              const rider = this.props.rider.ridersById(passing.riderId)
              return (
                <HFlex
                  key={passing._id}
                  style={{
                    justifyContent: 'space-between',
                    backgroundColor:
                      index % 2 === 0 ? Colors.white : Colors.whiteDark,
                  }}
                >
                  <div style={{ margin: 8 }}>{index + 1}</div>
                  <div style={{ flex: 1 }} />
                  <div style={{ margin: 8, minWidth: 100 }}>
                    {rider.firstname}
                  </div>
                  <div style={{ margin: 8, minWidth: 100 }}>
                    {' '}
                    {rider.lastname}
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ margin: 8, minWidth: 50 }}>
                    {passing.transponder}
                  </div>
                  <div style={{ margin: 8 }}>
                    {moment(passing.date).format('HH:mm:ss:SSS')}
                  </div>
                  <div style={{ margin: 8 }}>{passing.lapCount} laps</div>
                </HFlex>
              )
            })}
          </RootCell>
        ) : (
          <RootCell>
            <LargeText>{`This race hasn't started yet!`}</LargeText>
            <div style={{ margin: 8 }}>
              This race is scheduled to start at {race.scheduledStartTime}
            </div>
          </RootCell>
        )}
        <Footer />
      </>
    )
  }
}
