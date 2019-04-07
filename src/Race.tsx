import React from 'react'
import { inject, observer } from 'mobx-react'
import PromoterStore from './stores/promoter'
import PassingStore from './stores/passing'
import { RootCell, LargeText, VFlex, HFlex } from './components/Shared'
import Header from './components/Header'
import Footer from './components/Footer'
import RaceStore from './stores/race'
import SeriesStore from './stores/series'
import EventStore from './stores/event'
import RiderStore from './stores/rider'
import moment from 'moment'
import Colors from './Colors'

@inject('rider', 'promoter', 'passing', 'race', 'series', 'event')
@observer
export default class RaceScreen extends React.Component<{
  promoter: PromoterStore
  passing: PassingStore
  race: RaceStore
  series: SeriesStore
  event: EventStore
  rider: RiderStore
}> {
  reloadTimer: any
  async componentDidMount() {
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
      ...leaderboard.map((passing) => this.props.rider.load(passing.riderId)),
    ])
    this.reloadTimer = setInterval(
      () => this.props.race.loadLeaderboard(raceId),
      1000
    )
  }
  componentWillUnmount() {
    clearInterval(this.reloadTimer)
    this.reloadTimer = undefined
  }
  render() {
    const raceId = this.props.match.params.id
    const race = this.props.race.racesById(raceId)
    const series = this.props.series.seriesById(race.seriesId)
    const event = this.props.event.eventsById(race.eventId)
    const leaderboard = this.props.race.leaderboardByRaceId(raceId)
    return (
      <>
        <Header />
        <RootCell>
          <LargeText>
            {series.name} - {event.name} - {race.name}
          </LargeText>
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
                <div style={{ margin: 8 }}>{rider.firstname}</div>
                <div style={{ margin: 8 }}> {rider.lastname}</div>
                <div style={{ flex: 1 }} />
                <div style={{ margin: 8 }}>{passing.transponder}</div>
                <div style={{ margin: 8 }}>
                  {moment(passing.date).format('HH:mm:ss:SSS')}
                </div>
                <div style={{ margin: 8 }}>{passing.lapCount} laps</div>
              </HFlex>
            )
          })}
        </RootCell>
        <Footer />
      </>
    )
  }
}
