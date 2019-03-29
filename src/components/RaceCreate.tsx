import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import RaceStore from '../stores/race'
import EventStore from '../stores/event'

@inject('event', 'race')
@observer
class RaceCreate extends React.Component<{
  onCreated?: () => void
  onCancelled?: () => void
  race?: RaceStore
  event?: EventStore
  eventId: string
}> {
  state = {
    isLoading: false,
    raceData: {},
  }

  createRace = () => {
    this.setState({ isLoading: true })
    const { eventId } = this.props
    this.props.race
      .create({ ...this.state.raceData, eventId })
      .then(() => this.props.event.load(eventId))
      .then(() => this.setState({ isLoading: false }))
      .then(() => (this.props.onCreated || (() => {}))())
      .catch(() => this.setState({ isLoading: false }))
  }

  render() {
    const event = this.props.event.eventsById[this.props.eventId] || {}
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
                <Button
                  animating={this.state.isLoading}
                  title="Create Race"
                  onClick={this.createRace}
                />
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

export default RaceCreate
