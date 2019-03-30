import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './components/Shared'
import Header from './components/Header'
import { inject, observer } from 'mobx-react'
import EventStore from './stores/event'
import Colors from './Colors'
import Button from './components/Button'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Entrylist from './components/Entrylist'
import RiderStore from './stores/rider'
import SeriesStore, { Series } from './stores/series'
import styled from 'styled-components'
import Footer from './components/Footer'

const Cell = styled(VFlex)`
  flex: 1;
  background-color: ${Colors.white};
  padding: 8px;
  text-align: center;
  color: ${Colors.black};
  border-radius: 10px;
  border: solid 1px ${Colors.black};
  margin: 8px;
`

@inject('promoter', 'event', 'rider', 'series')
@observer
class Home extends React.Component<{
  event?: EventStore
  rider?: RiderStore
  series?: SeriesStore
}> {
  inputFileRef = React.createRef()

  componentDidMount() {
    this.props.event.loadUpcoming()
    this.props.series.load()
  }

  render() {
    return (
      <>
        <Header />
        <HFlex style={{ padding: 8, flex: 1 }}>
          {this.props.event.upcomingEvents.map((_event) => {
            const event = this.props.event.eventsById[_event._id] || {}
            const races = event.races || []
            return (
              <Cell key={_event._id}>
                <HFlex style={{ fontSize: 20 }}>
                  {(event.series || {}).name || ''} - {event.name}
                </HFlex>
                <HFlex>
                  {moment(event.startDate)
                    .utc()
                    .format('MMMM D YYYY')}
                </HFlex>
                <HFlex>
                  {races.length} race{races.length === 1 ? '' : 's'}
                </HFlex>
                {event.preregistrationUrl ? (
                  <a href={event.preregistrationUrl} target="_blank">
                    Pre-registration
                  </a>
                ) : null}
                {event.flyerUrl ? (
                  <a href={event.flyerUrl} target="_blank">
                    Race Flyer
                  </a>
                ) : null}
                <Link
                  style={{ textDecoration: 'none' }}
                  to={`/event/${event._id}`}
                >
                  <Button
                    style={{
                      backgroundColor: Colors.yellow,
                      color: Colors.black,
                    }}
                    title="View Details"
                  />
                </Link>
              </Cell>
            )
          })}
        </HFlex>
        <Footer />
      </>
    )
  }
}

export default Home
