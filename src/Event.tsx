import React from 'react'
import { inject, observer } from 'mobx-react'
import { VFlex, HFlex, ModalContainer, Input } from './components/Shared'
import Header from './components/Header'
import EventStore, { Event } from './stores/event'
import RaceStore, { Race } from './stores/race'
import styled from 'styled-components'
import moment from 'moment'
import Popup from './components/Popup'
import Button from './components/Button'

const LargeText = styled.div`
  font-size: 20px;
  margin: 8px;
`

@inject('promoter', 'event', 'race')
@observer
class _Event extends React.Component<{
  event: EventStore
  race: RaceStore
  match: any
}> {
  state = {
    raceCreateVisible: false,
    isLoading: false,
    raceData: {},
  }

  componentDidMount() {
    this.props.event.load(this.props.match.params.id)
  }

  createRace = () => {
    this.setState({ isLoading: true })
    const eventId = this.props.match.params.id
    this.props.race
      .create({ ...this.state.raceData, eventId })
      .then(() => this.props.event.load(eventId))
      .then(() => {
        this.setState({ isLoading: false, raceCreateVisible: false })
      })
      .catch(() => this.setState({ isLoading: false }))
  }

  render() {
    const eventId = this.props.match.params.id
    const event = this.props.event.eventsById[eventId] || ({} as Event)
    const races = event.races || []
    const dateFormat = 'MMMM Do YYYY'
    const dayDifference = moment(event.startDate).fromNow()
    return (
      <>
        <Header />
        <Popup visible={this.state.raceCreateVisible}>
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
                      onClick={() =>
                        this.setState({ raceCreateVisible: false })
                      }
                    />
                  </HFlex>
                </VFlex>
              </ModalContainer>
            </HFlex>
          </VFlex>
        </Popup>
        <HFlex style={{ justifyContent: 'space-between' }}>
          <VFlex style={{ alignItems: 'flex-start' }}>
            <LargeText>Event Name: {event.name}</LargeText>
            <LargeText>
              Event Start: {moment(event.startDate).format(dateFormat)} (
              {dayDifference})
            </LargeText>
            {event.startDate === event.endDate ? null : (
              <LargeText>Event End: {event.endDate}</LargeText>
            )}
            <LargeText>
              {races.length} Race{races.length !== 1 && 's'}
            </LargeText>
            {races.map((race: Race) => (
              <div
                key={race._id}
                style={{
                  margin: 8,
                  padding: 8,
                  borderRadius: 10,
                  backgroundColor: 'white',
                }}
              >
                {race.name}
              </div>
            ))}
          </VFlex>
          <VFlex style={{ alignItems: 'flex-end' }}>
            <LargeText
              onClick={() => this.setState({ raceCreateVisible: true })}
            >
              Create Race
            </LargeText>
          </VFlex>
        </HFlex>
      </>
    )
  }
}

export default _Event
