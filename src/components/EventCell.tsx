import React from 'react'
import PromoterStore from '../stores/promoter'
import EventStore from '../stores/event'
import { inject, observer } from 'mobx-react'
import { TiPlus } from 'react-icons/ti'
import { HFlex, VFlex } from './Shared'

@inject('promoter', 'event')
@observer
class EventCell extends React.Component<{
  id: string
  event?: EventStore
  promoter?: PromoterStore
}> {
  render() {
    const event = this.props.event.eventsById[this.props.id] || {}
    return (
      <div
        style={{
          minWidth: 80,
          minHeight: 80,
          padding: 5,
          margin: 5,
          backgroundColor: 'white',
          borderRadius: 10,
        }}
      >
        {event.name}
        <br />
        {event.startDate}
        <br />
        {event.endDate}
      </div>
    )
  }
}

export default EventCell
