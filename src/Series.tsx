import React from 'React'
import { inject, observer } from 'mobx-react'
import { HFlex, VFlex, Input, LargeText } from './components/Shared'
import SeriesStore from './stores/series'
import BibStore from './stores/bib'
import RiderStore from './stores/rider'
import Header from './components/Header'
import Button from './components/Button'
import keyby from 'lodash.keyby'
import Colors from './Colors'

@inject('series', 'event', 'rider', 'bib')
@observer
class Series extends React.Component<{
  series?: SeriesStore
  bib?: BibStore
  rider?: RiderStore
}> {
  state = {
    isSearching: false,
    foundRiders: [],
    updatedBibs: {},
  }
  componentDidMount() {
    const seriesId = this.props.match.params.id
    this.props.series.load(seriesId)
    this.props.series.load()
    this.props.bib.loadBibsForSeries(seriesId)
  }
  render() {
    const seriesId = this.props.match.params.id
    const series = this.props.series.seriesById[seriesId] || {}
    const bibs = this.props.bib.bibsBySeriesId[seriesId] || []
    const bibsByRiderId = keyby(bibs, 'riderId')

    return (
      <>
        <Header />
        <VFlex>
          <LargeText>{series.name}</LargeText>
        </VFlex>
        <VFlex>
          <LargeText>Active Bibs</LargeText>
        </VFlex>
        <HFlex style={{ justifyContent: 'space-between', margin: 16 }}>
          <VFlex>Bib #</VFlex>
          <VFlex>Firstname</VFlex>
          <VFlex>Lastname</VFlex>
          <VFlex>License</VFlex>
          <VFlex />
        </HFlex>
        {bibs.map((bib) => (
          <HFlex
            key={bib._id}
            style={{ justifyContent: 'space-between', margin: 16 }}
          >
            <VFlex>{bib.bibNumber}</VFlex>
            <VFlex>{bib.rider.firstname}</VFlex>
            <VFlex>{bib.rider.lastname}</VFlex>
            <VFlex>{bib.rider.license}</VFlex>
            <Button title="Delete" style={{ backgroundColor: Colors.pink }} />
          </HFlex>
        ))}
        <HFlex>
          Search:{' '}
          <Input
            valid
            type="text"
            onChange={(e: any) => {
              this.setState({ isSearching: true })
              this.props.rider
                .search(e.target.value)
                .then((riders) => {
                  this.setState({ isSearching: false })
                  this.setState({ foundRiders: riders })
                })
                .catch(() => this.setState({ isSearching: false }))
            }}
          />
          {this.state.isSearching ? (
            <img
              src={require('../static/puff.svg')}
              height="15"
              style={{ filter: 'brightness(0)' }}
            />
          ) : null}
        </HFlex>
        {this.state.foundRiders.map((rider: Rider) => (
          <HFlex key={rider._id} style={{ margin: 16, flexWrap: 'nowrap' }}>
            <VFlex style={{ alignItems: 'flex-start' }}>
              <HFlex>{`${rider.firstname} ${rider.lastname}`}</HFlex>
              <HFlex>{`License: ${rider.license}`}</HFlex>
              <HFlex>{`Status: ${
                new Date(rider.licenseExpirationDate) > new Date()
                  ? 'Active'
                  : 'Expired'
              }`}</HFlex>
            </VFlex>
            <Input
              valid
              type="text"
              placeholder={
                bibsByRiderId[rider._id]
                  ? bibsByRiderId[rider._id].bibNumber
                  : 'New Bib Number'
              }
              onChange={(e: any) => {
                this.setState({
                  updatedBibs: {
                    ...this.state.updatedBibs,
                    [rider._id]: e.target.value,
                  },
                })
              }}
            />
            <Button
              title="Update Bib"
              onClick={() => {
                this.props.bib
                  .create({
                    seriesId,
                    bibNumber: this.state.updatedBibs[rider._id],
                    riderId: rider._id,
                  })
                  .then(() => this.props.bib.loadBibsForSeries(seriesId))
              }}
            />
          </HFlex>
        ))}
      </>
    )
  }
}

export default Series
