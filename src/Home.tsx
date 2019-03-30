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

const Cell = styled(VFlex)`
  flex: 1;
  background-color: ${Colors.white};
  box-shadow: 1px 1px 20px ${Colors.black};
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  color: ${Colors.black};
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
        <VFlex style={{ flex: 1 }}>
          {this.props.event.upcomingEvents.map((_event) => {
            const event = this.props.event.eventsById[_event._id] || {}
            const races = event.races || []
            return (
              <Cell key={_event._id}>
                <HFlex style={{ fontSize: 20 }}>{(event.series || {}).name || ''} - {event.name}</HFlex>
                <HFlex>
                  {moment(event.startDate)
                    .utc()
                    .format("MMMM D 'YY")}
                </HFlex>
                {races.map((race: Race) => (
                  <Entrylist
                    key={race._id}
                    editable={false}
                    raceId={race._id}
                  />
                ))}
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
        </VFlex>
      </>
    )
  }
}

export default Home
