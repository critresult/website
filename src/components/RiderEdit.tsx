import React from 'react'
import { inject, observer } from 'mobx-react'
import RiderStore, { Rider } from '../stores/rider'
import { VFlex, HFlex, ModalContainer, Input, LargeText } from './Shared'
import Button from './Button'
import BibStore from '../stores/bib'
import LoadingIndicator from './LoadingIndicator'

@inject('rider', 'bib')
@observer
export default class RiderEdit extends React.Component<{
  riderId: string
  seriesId?: string
  onCancelled?: () => any
  onUpdated?: () => any
  rider?: RiderStore
  bib?: BibStore
}> {
  state = {
    riderData: {} as Rider,
    hasRentalTransponder: false,
    isLoading: false,
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    await Promise.all([
      this.props.rider.load(this.props.riderId),
      this.props.seriesId
        ? this.props.bib.loadBibsForSeries(this.props.seriesId)
        : Promise.resolve(),
    ])
    this.setState({
      isLoading: false,
    })
    if (!this.props.seriesId) return
    const bib = this.props.bib
      .bibsBySeriesId(this.props.seriesId)
      .find((bib) => bib.riderId === this.props.riderId)
    if (!bib) {
      console.log(
        `Error: Unable to find bib in series: ${
          this.props.seriesId
        } for rider id: ${this.props.riderId}`
      )
    }
    this.setState({
      hasRentalTransponder: bib.hasRentalTransponder,
    })
  }

  updateRiderData = (key: string, value: string) => {
    this.setState({
      riderData: {
        ...this.state.riderData,
        [key]: value,
      },
    })
  }

  /**
   * This function is overly complicated as a result of binding both rider edit
   * and bib edit into a single component. This is somewhat a result of the
   * result of the database schema. Should probably be refactored.
   **/
  update = async () => {
    try {
      const bib = this.props.bib
        .bibsBySeriesId(this.props.seriesId)
        .find((bib) => bib.riderId === this.props.riderId)
      if (this.props.seriesId && !bib) {
        throw new Error(
          `Error: Unable to find bib in series: ${
            this.props.seriesId
          } for rider id: ${this.props.riderId}`
        )
      } else if (this.props.seriesId) {
        // We have a bib
        await this.props.bib.update(bib._id, {
          hasRentalTransponder: this.state.hasRentalTransponder,
        })
        await this.props.bib.loadBibsForSeries(this.props.seriesId)
      }
      await this.props.rider.update(this.props.riderId, this.state.riderData)
      await this.props.rider.load(this.props.riderId)
      if (this.props.onUpdated) {
        this.props.onUpdated()
      }
    } catch (err) {
      console.log('Error updating rider', err)
    }
  }

  render() {
    const rider = this.props.rider.ridersById(this.props.riderId)
    return (
      <ModalContainer>
        <LargeText>Edit Rider</LargeText>
        {this.state.isLoading ? (
          <LoadingIndicator />
        ) : (
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
              Transponder:{' '}
              <Input
                type="text"
                placeholder={rider.transponder}
                onChange={(e: any) => {
                  this.updateRiderData('transponder', e.target.value)
                }}
              />
            </HFlex>
            <HFlex>
              Team:{' '}
              <Input
                type="text"
                placeholder={rider.teamName}
                onChange={(e: any) => {
                  this.updateRiderData('teamName', e.target.value)
                }}
              />
            </HFlex>
            {this.props.seriesId ? (
              <HFlex>
                Has Rental Transponder:
                <Input
                  type="checkbox"
                  checked={!!this.state.hasRentalTransponder}
                  onChange={(e: any) => {
                    this.setState({
                      hasRentalTransponder: e.target.checked,
                    })
                  }}
                />
              </HFlex>
            ) : null}
            <HFlex>
              <Button title="Update Rider" onClick={this.update} />
              <Button
                title="Cancel"
                onClick={this.props.onCancelled || (() => {})}
              />
            </HFlex>
          </VFlex>
        )}
      </ModalContainer>
    )
  }
}
