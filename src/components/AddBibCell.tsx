import React from 'react'
import { VFlex, HFlex, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import BibStore from '../stores/bib'
import RiderStore, { Rider } from '../stores/rider'

@inject('bib', 'rider')
@observer
export default class SeriesBibCell extends React.Component<{
  seriesId: string
  _rider: Rider
  bibNumber?: string | number
  bib?: BibStore
  rider?: RiderStore
}> {
  state = {
    selectedBib: '',
  }
  render() {
    const rider = this.props._rider
    return (
      <HFlex
        style={{
          justifyContent: 'space-between',
          margin: 8,
          marginBottom: 0,
        }}
      >
        <VFlex style={{ minWidth: '15%' }}>{rider.firstname}</VFlex>
        <VFlex style={{ minWidth: '15%' }}>{rider.lastname}</VFlex>
        <VFlex style={{ minWidth: '15%' }}>{rider.license}</VFlex>
        <VFlex style={{ minWidth: '15%' }}>
          {new Date(rider.licenseExpirationDate) > new Date()
            ? 'License Active'
            : 'License Expired'}
        </VFlex>
        <VFlex style={{ minWidth: '10%' }}>
          <Input
            valid
            type="text"
            placeholder={
              this.props.bibNumber ? this.props.bibNumber : 'New Bib Number'
            }
            onChange={(e: any) => {
              this.setState({
                selectedBib: e.target.value,
              })
            }}
            value={this.state.selectedBib || ''}
          />
        </VFlex>
        <VFlex style={{ flex: 1 }}>
          <Button
            animating={this.state.isLoading}
            title="Add Bib"
            onClick={() =>
              this.props.bib
                .create({
                  seriesId: this.props.seriesId,
                  bibNumber: this.state.selectedBib,
                  riderId: rider._id,
                })
                .then(() =>
                  this.props.bib.loadBibsForSeries(this.props.seriesId)
                )
                .then(() =>
                  this.setState({
                    selectedBib: '',
                  })
                )
            }
          />
        </VFlex>
      </HFlex>
    )
  }
}
