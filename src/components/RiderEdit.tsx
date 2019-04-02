import React from 'react'
import { inject, observer } from 'mobx-react'
import RiderStore, { Rider } from '../stores/rider'
import { VFlex, HFlex, ModalContainer, Input, LargeText } from './Shared'
import Button from './Button'

@inject('rider')
@observer
class RiderEdit extends React.Component<{
  riderId: string
  onCancelled?: () => any
  onUpdated?: () => any
  rider?: RiderStore
}> {
  state = {
    riderData: {} as Rider,
  }

  async componentDidMount() {
    await this.props.rider.load(this.props.riderId)
  }

  updateRiderData = (key: string, value: string) => {
    this.setState({
      riderData: {
        ...this.state.riderData,
        [key]: value,
      },
    })
  }

  render() {
    const rider =
      this.props.rider.ridersById[this.props.riderId] || ({} as Rider)
    return (
      <ModalContainer>
        <LargeText>Edit Rider</LargeText>
        <VFlex>
          <HFlex>
            First Name:{' '}
            <Input
              valid={!!this.state.riderData.firstname}
              type="text"
              placeholder={rider.firstname}
              onChange={(e: any) => {
                this.updateRiderData('firstname', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            Last Name:{' '}
            <Input
              valid={!!this.state.riderData.lastname}
              type="text"
              placeholder={rider.lastname}
              onChange={(e: any) => {
                this.updateRiderData('lastname', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            Email:{' '}
            <Input
              type="text"
              placeholder={rider.email}
              onChange={(e: any) => {
                this.updateRiderData('email', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            Phone:{' '}
            <Input
              type="text"
              placeholder={rider.phone}
              onChange={(e: any) => {
                this.updateRiderData('phone', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            License #:{' '}
            <Input
              type="text"
              placeholder={rider.license}
              onChange={(e: any) => {
                this.updateRiderData('license', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            Team:{' '}
            <Input
              type="text"
              placeholder={rider.team}
              onChange={(e: any) => {
                this.updateRiderData('team', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            <Button title="Update Rider" onClick={() => {}} />
            <Button
              title="Cancel"
              onClick={this.props.onCancelled || (() => {})}
            />
          </HFlex>
        </VFlex>
      </ModalContainer>
    )
  }
}
export default RiderEdit
