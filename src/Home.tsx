import React from 'react'
import {
  VFlex,
  HFlex,
  LargeText,
  RootCell,
  TitleText,
} from './components/Shared'
import Header from './components/Header'
import { inject, observer } from 'mobx-react'
import EventStore from './stores/event'
import Colors from './Colors'
import Button from './components/Button'
import { Link } from 'react-router-dom'
import moment from 'moment'
import RiderStore from './stores/rider'
import SeriesStore from './stores/series'
import Footer from './components/Footer'
import LoadingIndicator from './components/LoadingIndicator'

@inject('promoter', 'event', 'rider', 'series')
@observer
export default class Home extends React.Component<{
  event?: EventStore
  rider?: RiderStore
  series?: SeriesStore
}> {
  inputFileRef = React.createRef()

  state = {
    loading: true,
  }

  async componentDidMount() {
    await Promise.all([this.props.event.loadHome()])
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ loading: false })
  }

  render() {
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
                <TitleText>Events</TitleText>
              </VFlex>
            </RootCell>
            <HFlex
              style={{
                justifyContent: 'space-around',
                alignItems: 'space-around',
                margin: 'auto',
              }}
            >
              {this.props.event.homeEvents.map((_event) => {
                const event = this.props.event.eventsById(_event._id)
                const series = this.props.series.seriesById(event.seriesId)
                const races = this.props.event.racesByEventId(_event._id)
                return (
                  <RootCell key={_event._id} style={{ flex: 1, margin: 8 }}>
                    <VFlex style={{ minWidth: 250, minHeight: 100 }}>
                      <HFlex style={{ fontSize: 20 }}>
                        {series.name || ''} - {event.name}
                      </HFlex>
                      <HFlex>
                        {moment(event.startDate)
                          .utc()
                          .format('MMMM D, YYYY')}
                        {' - '}
                        {races.length} race
                        {races.length === 1 ? '' : 's'}
                      </HFlex>
                      <div style={{ flex: 1 }} />
                      <Link
                        style={{ textDecoration: 'none' }}
                        to={`/race/${(races[0] || {})._id}`}
                      >
                        <Button
                          style={{
                            backgroundColor: Colors.yellow,
                            color: Colors.black,
                          }}
                          title="View Details"
                        />
                      </Link>
                    </VFlex>
                  </RootCell>
                )
              })}
            </HFlex>
          </>
        )}
        <Footer />
      </>
    )
  }
}
