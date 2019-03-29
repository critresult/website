import React from 'react'
import PromoterStore from '../stores/promoter'
import EventStore from '../stores/event'
import { inject, observer } from 'mobx-react'
import { TiPlus } from 'react-icons/ti'
import { HFlex, VFlex } from './Shared'
import { Link } from 'react-router-dom'
import Colors from '../Colors'
import moment from 'moment'

@inject('promoter', 'event')
@observer
class EventCell extends React.Component<{
  id: string
  event?: EventStore
  promoter?: PromoterStore
}> {
  render() {
    const event = this.props.event.eventsById[this.props.id] || {}
    const races = event.races || []
    return (
      <Link style={{ textDecoration: 'none' }} to={`/event/${event._id}`}>
        <div
          style={{
            minWidth: 80,
            minHeight: 80,
            padding: 5,
            margin: 5,
            backgroundColor: 'white',
            borderRadius: 10,
            color: Colors.black,
            textDecoration: 'none',
          }}
        >
          {event.name}
          <br />
          {moment(event.startDate)
            .utc()
            .format('dddd MMMM D, YYYY')}
          <br />
          {races.length} Races
        </div>
      </Link>
    )
  }
}

export default EventCell
