import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './components/Shared'
import Header from './components/Header'
import { inject, observer } from 'mobx-react'
import EventStore from './stores/event'
import Colors from './Colors'
import { TiPlus } from 'react-icons/ti'
import Popup from './components/Popup'
import Button from './components/Button'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Entrylist from './components/Entrylist'

@inject('promoter', 'event')
@observer
class Home extends React.Component<{
  event?: EventStore
}> {
  state = {
    showingCreatePopup: false,
    isLoading: false,
    eventData: {},
  }

  componentDidMount() {
    this.props.event.loadUpcoming()
  }

  createEvent = () => {
    this.setState({ isLoading: true })
    this.props.event
      .create(this.state.eventData as Event)
      .then(() => this.props.event.loadUpcoming())
      .then(() =>
        this.setState({
          isLoading: false,
          showingCreatePopup: false,
        })
      )
      .catch(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    return (
      <>
        <Header />
        <Popup visible={this.state.showingCreatePopup}>
          <VFlex>
            <HFlex style={{ borderRadius: 5 }}>
              <ModalContainer>
                <VFlex style={{ padding: 10 }}>
                  <HFlex>
                    Event Name:{' '}
                    <Input
                      valid
                      type="text"
                      onChange={(e: any) => {
                        this.setState({
                          eventData: {
                            ...this.state.eventData,
                            name: e.target.value,
                          },
                        })
                      }}
                    />
                  </HFlex>
                  <HFlex>
                    Event Date:{' '}
                    <Input
                      valid
                      type="date"
                      onChange={(e: any) => {
                        const date = new Date(e.target.value).toISOString()
                        this.setState({
                          eventData: {
                            ...this.state.eventData,
                            startDate: date,
                            endDate: date,
                          },
                        })
                      }}
                    />
                  </HFlex>
                  <HFlex style={{ padding: 8, textAlign: 'center' }}>
                    Additional options can be configured after creation.
                  </HFlex>
                  <HFlex>
                    <Button
                      animating={this.state.isLoading}
                      title="Create Event"
                      onClick={this.createEvent}
                    />
                    <Button
                      title="Cancel"
                      onClick={() =>
                        this.setState({ showingCreatePopup: false })
                      }
                    />
                  </HFlex>
                </VFlex>
              </ModalContainer>
            </HFlex>
          </VFlex>
        </Popup>
        <VFlex style={{ flex: 1 }}>
          <div
            onClick={() => this.setState({ showingCreatePopup: true })}
            style={{
              borderRadius: 10,
              border: `${Colors.black} solid 2px`,
              backgroundColor: Colors.white,
              padding: 5,
              margin: 5,
              minWidth: 80,
              minHeight: 80,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <TiPlus color={Colors.black} size={70} />
          </div>
          {this.props.event.upcomingEvents.map((_event) => {
            const event = this.props.event.eventsById[_event._id] || {}
            const races = event.races || []
            return (
              <VFlex
                key={_event._id}
                style={{
                  flex: 1,
                  backgroundColor: Colors.white,
                  boxShadow: `2px 2px 10px ${Colors.black}`,
                  padding: 15,
                  marginBottom: 10,
                  textAlign: 'center',
                  color: Colors.black,
                }}
              >
                <HFlex style={{ fontSize: 20 }}>{event.name}</HFlex>
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
                  <Button style={{ backgroundColor: Colors.yellow, color: Colors.black }} title="View Details" />
                </Link>
              </VFlex>
            )
          })}
        </VFlex>
      </>
    )
  }
}

export default Home
