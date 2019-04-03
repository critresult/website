import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import RaceStore from '../stores/race'
import EventStore, { Event } from '../stores/event'

@inject('event', 'race')
@observer
export default class RaceCreate extends React.Component<{
  onCreated?: () => void
  onCancelled?: () => void
  race?: RaceStore
  event?: EventStore
  eventId: string
}> {
  state = {
    raceData: {},
  }

  createRace = async () => {
    const { eventId } = this.props
    await this.props.race.create({ ...this.state.raceData, eventId })
    await this.props.event.load(eventId)
    await (this.props.onCreated || (() => {}))()
  }

  render() {
    const event = this.props.event.eventsById[this.props.eventId] || ({} as Event)
    return (
      <VFlex>
        <HFlex style={{ borderRadius: 5 }}>
          <ModalContainer>
            <VFlex style={{ padding: 10 }}>
              <HFlex>
                Race Name:{' '}
                <Input
                  valid
                  type="text"
                  onChange={(e: any) => {
                    this.setState({
                      raceData: {
                        ...this.state.raceData,
                        name: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                Start Time:{' '}
                <Input
                  valid
                  type="time"
                  onChange={(e: any) => {
                    this.setState({
                      raceData: {
                        ...this.state.raceData,
                        scheduledStartTime: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>Event: {event.name}</HFlex>
              <HFlex>
                <Button title="Create Race" onClick={this.createRace} />
                <Button
                  title="Cancel"
                  onClick={this.props.onCancelled || (() => {})}
                />
              </HFlex>
            </VFlex>
          </ModalContainer>
        </HFlex>
      </VFlex>
    )
  }
}
