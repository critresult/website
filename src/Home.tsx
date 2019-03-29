import React from 'react'
import { VFlex, HFlex, ModalContainer } from './components/Shared'
import Header from './components/Header'
import { inject, observer } from 'mobx-react'
import EventCell from './components/EventCell'
import EventStore from './stores/event'
import Colors from './Colors'
import { TiPlus } from 'react-icons/ti'
import Popup from './components/Popup'

@inject('promoter', 'event')
@observer
class Home extends React.Component<{
  event?: EventStore
}> {
  state = {
    showingCreatePopup: false,
  }

  componentDidMount() {
    this.props.event.loadUpcoming()
  }

  render() {
    return (
      <>
        <Header />
        <Popup visible={this.state.showingCreatePopup}>
          <VFlex>
            <HFlex style={{ borderRadius: 5 }}>
              <ModalContainer />
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
            {this.props.event.upcomingEvents.map((event) => (
              <div>{event.name}</div>
            ))}
          </HFlex>
        </div>
      </>
    )
  }
}

export default Home
