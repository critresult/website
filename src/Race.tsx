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
import idx from 'idx'
import LoadingIndicator from './components/LoadingIndicator'
import BibStore from './stores/bib'

@inject('rider', 'promoter', 'passing', 'race', 'series', 'event', 'bib')
@observer
export default class RaceScreen extends React.Component<{
  promoter: PromoterStore
  passing: PassingStore
  race: RaceStore
  series: SeriesStore
  event: EventStore
  rider: RiderStore
  bib: BibStore
  match: any
}> {
  reloadTimer: any

  state = {
    loading: true,
  }

  async componentDidMount() {
    this.componentDidUpdate({})
  }

  componentDidUpdate(prevProps: any) {
    const raceId = this.props.match.params.id
    const lastRaceId = idx(prevProps, (_: any) => _.match.params.id)
    if (raceId === lastRaceId) return
    this.setState({ loading: true })
    clearInterval(this.reloadTimer)
    this.reloadTimer = undefined
    this.loadResultData()
      .then(() => this.setState({ loading: false }))
      .catch((err) => {
        this.setState({ loading: false })
        throw err
      })
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
      this.props.bib.loadBibsForSeries(race.seriesId),
      this.props.series.load(race.seriesId),
      this.props.event.load(race.eventId),
      this.props.event.loadRacesByEventId(race.eventId),
      this.props.rider.loadMany(
        leaderboard
          .filter((passing) => !!passing.riderId)
          .map((passing) => passing.riderId)
      ),
    ])
    this.reloadTimer = setInterval(() => {
      this.props.race.loadLeaderboard(raceId).then(() => {
        const leaderboard = this.props.race.leaderboardByRaceId(raceId)
        const unloadedRiderIds = leaderboard
          .filter((passing) => !!passing.riderId)
          .filter(
            (passing) => !this.props.rider.ridersById(passing.riderId)._id
          )
          .map((passing) => passing.riderId)
        if (unloadedRiderIds.length === 0) return
        this.props.rider.loadMany(unloadedRiderIds)
      })
      this.props.race.load(raceId)
    }, 5000)
  }

  render() {
    const raceId = this.props.match.params.id
    const race = this.props.race.racesById(raceId)
    const series = this.props.series.seriesById(race.seriesId)
    const event = this.props.event.eventsById(race.eventId)
    const leaderboard = this.props.race.leaderboardByRaceId(raceId)
    const allRaces = this.props.event.racesByEventId(race.eventId)
    return (
      <>
        <Header />
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
                  {series.name} - {event.name}
                </TitleText>
                {event.startDate === event.endDate ? null : (
                  <LargeText>Event End: {event.endDate}</LargeText>
                )}
              </VFlex>
              <VFlex>
                <HFlex>
                  {allRaces.map((race) => (
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
                    {moment(race.actualStart).format('HH:mm:ss')} start
                    {race.lapCount ? ` - ${race.lapCount} laps` : ''}
                  </LargeText>
                </HFlex>
                {leaderboard.map((passing, index) => {
                  const bib =
                    this.props.bib
                      .bibsBySeriesId(passing.seriesId)
                      .find((_bib: any) => _bib.riderId === passing.riderId) ||
                    {}
                  const rider = this.props.rider.ridersById(passing.riderId)
                  return (
                    <HFlex
                      key={passing._id}
                      style={{
                        justifyContent: 'space-around',
                        backgroundColor:
                          index % 2 === 0 ? Colors.white : Colors.whiteDark,
                      }}
                    >
                      <div style={{ margin: 8, minWidth: 30 }}>{index + 1}</div>
                      <div style={{ margin: 8, minWidth: 200 }}>
                        {rider.lastname.toUpperCase()}
                      </div>
                      <div style={{ margin: 8, minWidth: 50 }}>
                        #{bib.bibNumber || '-'}
                      </div>
                      <div style={{ flex: 1 }} />
                      <div style={{ margin: 8, minWidth: 50 }}>
                        {typeof passing.secondsDiff === 'number' ? `+${passing.secondsDiff} s` : ''}
                      </div>
                      <div style={{ flex: 1 }} />
                      <div style={{ margin: 8 }}>
                        {moment(passing.date).format('HH:mm:ss:SSS')}
                      </div>
                      <div style={{ flex: 1 }} />
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
          </>
        )}
        <Footer />
      </>
    )
  }
}
