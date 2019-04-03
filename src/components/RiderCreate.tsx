import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import RaceStore from '../stores/race'
import EventStore from '../stores/event'
import RiderStore from '../stores/rider'
import BibStore from '../stores/bib'

@inject('event', 'race', 'rider', 'bib')
@observer
export default class RiderCreate extends React.Component<{
  onCreated?: () => void
  onCancelled?: () => void
  seriesId?: string
  raceId?: string
  race?: RaceStore
  event?: EventStore
  rider?: RiderStore
  bib?: BibStore
}> {
  state = {
    riderData: {},
    bibNumber: 0,
  }

  createRider = async () => {
    const rider = await this.props.rider.create({ ...this.state.riderData })
    if (this.props.seriesId && this.state.bibNumber) {
      const bib = await this.props.bib.create({
        bibNumber: this.state.bibNumber,
        riderId: rider._id,
        seriesId: this.props.seriesId,
      })
      if (this.props.raceId) {
        await this.props.race.addEntry(this.props.raceId, rider._id, bib._id)
        await this.props.race.loadEntries(this.props.raceId)
      }
    }

    ;(this.props.onCreated || (() => {}))()
  }

  updateRiderData = (key: string, value: any) => {
    this.setState({
      riderData: {
        ...this.state.riderData,
        [key]: value,
      },
    })
  }

  render() {
    return (
      <ModalContainer>
        <VFlex style={{ padding: 10 }}>
          <HFlex>
            First Name:{' '}
            <Input
              valid={!!this.state.riderData.firstname}
              type="text"
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
              onChange={(e: any) => {
                this.updateRiderData('lastname', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            Email:{' '}
            <Input
              type="text"
              onChange={(e: any) => {
                this.updateRiderData('email', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            Phone:{' '}
            <Input
              type="text"
              onChange={(e: any) => {
                this.updateRiderData('phone', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            License #:{' '}
            <Input
              type="text"
              placeholder="Empty for one day license"
              onChange={(e: any) => {
                this.updateRiderData('license', e.target.value)
              }}
            />
          </HFlex>
          <HFlex>
            Team:{' '}
            <Input
              type="text"
              onChange={(e: any) => {
                this.updateRiderData('teamName', e.target.value)
              }}
            />
          </HFlex>
          {this.props.seriesId ? (
            <HFlex>
              Bib #:{' '}
              <Input
                valid={!!this.state.bibNumber}
                type="text"
                onChange={(e: any) => {
                  this.setState({
                    bibNumber: e.target.value,
                  })
                }}
              />
            </HFlex>
          ) : null}
          <HFlex>
            <Button title="Create Rider" onClick={this.createRider} />
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
