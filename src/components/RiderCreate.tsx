import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import RaceStore from '../stores/race'
import EventStore from '../stores/event'
import RiderStore from '../stores/rider'

@inject('event', 'race', 'rider')
@observer
class RiderCreate extends React.Component<{
  onCreated?: () => void
  onCancelled?: () => void
  race?: RaceStore
  event?: EventStore
  rider?: RiderStore
}> {
  state = {
    isLoading: false,
    riderData: {},
  }

  createRider = () => {
    this.setState({ isLoading: true })
    this.props.rider
      .create({ ...this.state.riderData })
      .then(() => this.setState({ isLoading: false }))
      .then(() => (this.props.onCreated || (() => {}))())
      .catch(() => this.setState({ isLoading: false }))
  }

  render() {
    return (
      <VFlex>
        <HFlex style={{ borderRadius: 5 }}>
          <ModalContainer>
            <VFlex style={{ padding: 10 }}>
              <HFlex>
                First Name:{' '}
                <Input
                  valid
                  type="text"
                  onChange={(e: any) => {
                    this.setState({
                      riderData: {
                        ...this.state.riderData,
                        firstname: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                Last Name:{' '}
                <Input
                  valid
                  type="text"
                  onChange={(e: any) => {
                    this.setState({
                      riderData: {
                        ...this.state.riderData,
                        lastname: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                Email:{' '}
                <Input
                  valid
                  type="text"
                  onChange={(e: any) => {
                    this.setState({
                      riderData: {
                        ...this.state.riderData,
                        email: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                Phone:{' '}
                <Input
                  valid
                  type="text"
                  onChange={(e: any) => {
                    this.setState({
                      riderData: {
                        ...this.state.riderData,
                        phone: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                License Number:{' '}
                <Input
                  valid
                  type="text"
                  onChange={(e: any) => {
                    this.setState({
                      riderData: {
                        ...this.state.riderData,
                        license: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                Birthdate:{' '}
                <Input
                  valid
                  type="date"
                  onChange={(e: any) => {
                    this.setState({
                      riderData: {
                        ...this.state.riderData,
                        birthdate: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                Team:{' '}
                <Input
                  valid
                  type="text"
                  onChange={(e: any) => {
                    this.setState({
                      riderData: {
                        ...this.state.riderData,
                        team: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                <Button
                  animating={this.state.isLoading}
                  title="Create Rider"
                  onClick={this.createRider}
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

export default RiderCreate
