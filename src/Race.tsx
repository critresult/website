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
  AutoHide,
  MobileOnly,
  NonMobileOnly,
  Input,
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
import startcase from 'lodash.startcase'
import truncate from 'lodash.truncate'
import axios from 'axios'

const DATE_FORMAT = 'hh:mm:ss A - MMM DD, YYYY'

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
    raceLapCount: '',
    raceStartTime: '',
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
      .then(() => {
        const race = this.props.race.racesById(raceId)
        this.setState({
          loading: false,
          raceStartTime: moment(race.actualStart).format(DATE_FORMAT),
        })
      })
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
        leaderboard.passings
          .filter((passing) => !!passing.riderId)
          .map((passing) => passing.riderId)
      ),
    ])
    this.reloadTimer = setInterval(() => {
      this.props.race.loadLeaderboard(raceId).then(() => {
        const leaderboard = this.props.race.leaderboardByRaceId(raceId)
        const unloadedRiderIds = leaderboard.passings
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
            {this.props.promoter.authenticated ? (
              <RootCell>
                <VFlex>
                  <LargeText>Promoter Settings</LargeText>
                </VFlex>
                <VFlex>
                  <HFlex>
                    {!race.actualStart ? (
                      <Button
                        title="Start Race"
                        style={{
                          backgroundColor: Colors.green,
                        }}
                        onClick={() =>
                          this.props.race
                            .update(race._id, { actualStart: new Date() })
                            .then(() => this.props.race.load(race._id))
                            .then(() => {
                              const startDate = this.props.race.racesById(
                                race._id
                              ).actualStart
                              this.setState({
                                raceStartTime: moment(startDate).format(
                                  DATE_FORMAT
                                ),
                              })
                            })
                        }
                      />
                    ) : (
                      <>
                        <Input
                          type="text"
                          value={this.state.raceStartTime}
                          onChange={(e) => {
                            this.setState({
                              raceStartTime: e.target.value,
                            })
                          }}
                        />
                        <Button
                          title="Update Start Time"
                          onClick={() => {
                            const newStart = moment(
                              this.state.raceStartTime,
                              DATE_FORMAT,
                              true
                            )
                            if (!newStart.isValid()) {
                              alert(
                                'Your date is formatted incorrectly. Please edit the date in place and keep the formatting the same.'
                              )
                              this.setState({
                                raceStartTime: moment(race.actualStart).format(
                                  DATE_FORMAT
                                ),
                              })
                              return
                            }
                            return this.props.race
                              .update(race._id, {
                                actualStart: newStart.toISOString(),
                              })
                              .then(() => this.props.race.load(race._id))
                          }}
                        />
                      </>
                    )}
                  </HFlex>
                </VFlex>
                <VFlex>
                  <HFlex>
                    <Input
                      type="text"
                      placeholder={`lap count: ${race.lapCount || 0}`}
                      onChange={(e) => {
                        this.setState({ raceLapCount: e.target.value })
                      }}
                      value={this.state.raceLapCount}
                    />
                    <Button
                      title="Update Final Count"
                      onClick={() => {
                        if (!this.state.raceLapCount) {
                          alert('Lap count must be a number')
                          return
                        }
                        return this.props.race
                          .update(race._id, {
                            lapCount: this.state.raceLapCount,
                          })
                          .then(() => this.props.race.load(race._id))
                          .then(() => this.setState({ raceLapCount: '' }))
                      }}
                    />
                  </HFlex>
                </VFlex>
                <VFlex>
                  <HFlex>
                    <Button
                      title="Export CSV"
                      style={{
                        backgroundColor: Colors.green,
                      }}
                      onClick={async () => {
                        // Generate and download result CSV
                        window.open(
                          `${axios.defaults.baseURL}/events/csv?eventId=${
                            race.eventId
                          }&token=${this.props.promoter.token}`
                        )
                      }}
                    />
                  </HFlex>
                </VFlex>
              </RootCell>
            ) : null}
            {race.actualStart ? (
              <RootCell>
                <NonMobileOnly>
                  <HFlex style={{ justifyContent: 'space-between' }}>
                    <LargeText style={{ minWidth: 100 }}>
                      {moment(race.actualStart).format('hh:mm a')}
                    </LargeText>
                    <TitleText>
                      {leaderboard.isFinished
                        ? '🏁 Final Results 🏁'
                        : 'Racing Now'}
                    </TitleText>
                    <LargeText style={{ textAlign: 'right', minWidth: 100 }}>
                      {leaderboard.isFinished && race.lapCount ? (
                        `${race.lapCount} laps`
                      ) : (
                        <LoadingIndicator height={50} />
                      )}
                    </LargeText>
                  </HFlex>
                </NonMobileOnly>
                <MobileOnly>
                  <HFlex style={{ justifyContent: 'center' }}>
                    <TitleText>
                      {leaderboard.isFinished
                        ? '🏁 Final Results 🏁'
                        : 'Racing Now'}
                    </TitleText>
                  </HFlex>
                  <HFlex style={{ justifyContent: 'space-between' }}>
                    <LargeText>
                      {moment(race.actualStart).format('HH:mm:ss')} start
                    </LargeText>
                    <LargeText style={{ textAlign: 'right' }}>
                      {leaderboard.isFinished && race.lapCount ? (
                        `${race.lapCount} laps`
                      ) : (
                        <LoadingIndicator style={{ margin: 0 }} height={50} />
                      )}
                    </LargeText>
                  </HFlex>
                </MobileOnly>
                {leaderboard.passings.map((passing, index) => {
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
                          index % 2 === 1 ? Colors.white : Colors.whiteDark,
                      }}
                    >
                      <div style={{ margin: 8, minWidth: 30 }}>{index + 1}</div>
                      <div style={{ margin: 8, minWidth: 250 }}>
                        {`${rider.firstname
                          .slice(0, 1)
                          .toUpperCase()}. ${rider.lastname.toUpperCase()}`}
                      </div>
                      <div style={{ margin: 8, minWidth: 50 }}>
                        #{bib.bibNumber || '-'}
                      </div>
                      <AutoHide style={{ flex: 1 }}>
                        <div style={{ margin: 8, minWidth: 250 }}>
                          {truncate(
                            startcase(
                              (rider.teamName || 'no team').toLowerCase()
                            ),
                            {
                              length: 30,
                            }
                          )}
                        </div>
                      </AutoHide>
                      <div style={{ margin: 8, minWidth: 50 }}>
                        {typeof passing.secondsDiff === 'number'
                          ? `+${passing.secondsDiff} s`
                          : ''}
                      </div>
                      <AutoHide style={{ flex: 1 }}>
                        <div style={{ margin: 8 }}>
                          {moment(passing.date).format('HH:mm:ss:SSS')}
                        </div>
                      </AutoHide>
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
