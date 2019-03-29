import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './components/Shared'
import Header from './components/Header'
import { inject, observer } from 'mobx-react'
import EventCell from './components/EventCell'
import EventStore from './stores/event'
import Colors from './Colors'
import { TiPlus } from 'react-icons/ti'
import Popup from './components/Popup'
import Button from './components/Button'

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
    console.log(this.state.eventData)
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
        <div
          style={{
            padding: 20,
            margin: 'auto',
            maxWidth: 900,
          }}
        >
          Upcoming Events:
          <HFlex>
            <div
              onClick={() => this.setState({ showingCreatePopup: true })}
              style={{
                borderRadius: 10,
                backgroundColor: Colors.black,
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
              <TiPlus color={Colors.white} size={70} />
            </div>
            {this.props.event.upcomingEvents.map((event, index) => (
              <EventCell id={event._id} key={index} />
            ))}
          </HFlex>
        </div>
      </>
    )
  }
}

export default Home
