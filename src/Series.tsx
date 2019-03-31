import React from 'react'
import { inject, observer } from 'mobx-react'
import { HFlex, VFlex, Input, LargeText, RootCell } from './components/Shared'
import SeriesStore from './stores/series'
import BibStore from './stores/bib'
import RiderStore, { Rider } from './stores/rider'
import Header from './components/Header'
import Button from './components/Button'
import keyby from 'lodash.keyby'
import Colors from './Colors'
import AddBibCell from './components/AddBibCell'
import idx from 'idx'
import Footer from './components/Footer'

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
  }

  searchRef = React.createRef()

  componentDidMount() {
    const seriesId = this.props.match.params.id
    this.props.series.load(seriesId)
    this.props.bib.loadBibsForSeries(seriesId)
    this.props.series.load()
    this.searchRef.current.focus()
  }

  componentWillReceiveProps(newProps: any) {
    const seriesId = idx(this, (_: any) => _.props.match.params.id)
    const newSeriesId = idx(newProps, (_: any) => _.match.params.id)
    if (newSeriesId !== seriesId) {
      this.props.series.load(newSeriesId)
      this.props.bib.loadBibsForSeries(newSeriesId)
    }
  }

  searchChanged = (e: any) => {
    const newSearchString = e.target.value
    if (newSearchString.length === 0) {
      this.setState({ foundRiders: [], isSearching: false })
      return
    }
    this.setState({ isSearching: true })
    this.props.rider
      .search(newSearchString)
      .then((riders) => {
        if (this.searchRef.current.value !== newSearchString) return
        this.setState({ isSearching: false })
        this.setState({ foundRiders: riders })
      })
      .catch(() => this.setState({ isSearching: false }))
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
        <RootCell>
          <VFlex
            style={{
              backgroundColor: Colors.white,
              margin: 8,
              borderRadius: 10,
            }}
          >
            <LargeText>Add Rider to Series</LargeText>
            <HFlex>
              Search:
              <Input
                ref={this.searchRef}
                valid
                type="text"
                placeholder="firstname, lastname, or license #"
                style={{ minWidth: 200 }}
                onChange={this.searchChanged}
              />
              {this.state.isSearching ? (
                <img
                  src={require('../static/puff.svg')}
                  height="15"
                  style={{ filter: 'brightness(0)' }}
                />
              ) : null}
            </HFlex>
          </VFlex>
          {this.state.foundRiders.map((_rider: Rider) => (
            <AddBibCell
              key={_rider._id}
              seriesId={seriesId}
              _rider={_rider}
              bibNumber={(bibsByRiderId[_rider._id] || {}).bibNumber}
            />
          ))}
        </RootCell>
        <RootCell>
          <VFlex>
            <LargeText>Active Bibs ({bibs.length})</LargeText>
          </VFlex>
          <HFlex style={{ justifyContent: 'space-between', margin: 16 }}>
            <VFlex style={{ minWidth: '15%' }}>Bib #</VFlex>
            <VFlex style={{ minWidth: '15%' }}>Firstname</VFlex>
            <VFlex style={{ minWidth: '15%' }}>Lastname</VFlex>
            <VFlex style={{ minWidth: '15%' }}>License</VFlex>
            <VFlex style={{ flex: 1 }} />
          </HFlex>
          {bibs
            .slice()
            .sort((a, b) => (a.bibNumber > b.bibNumber ? 1 : -1))
            .map((bib) => (
              <HFlex
                key={bib._id}
                style={{
                  justifyContent: 'space-between',
                  margin: 4,
                  marginBottom: 0,
                }}
              >
                <VFlex style={{ minWidth: '15%' }}>{bib.bibNumber}</VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  {idx(bib, (_: any) => _.rider.firstname)}
                </VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  {idx(bib, (_: any) => _.rider.lastname)}
                </VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  {idx(bib, (_: any) => _.rider.license)}
                </VFlex>
                <VFlex style={{ flex: 1 }}>
                  <HFlex>
                    <Button
                      title="Edit"
                      style={{
                        backgroundColor: Colors.yellow,
                        color: Colors.black,
                        flex: 1,
                      }}
                      onClick={() => {}}
                    />
                    <Button
                      title="Delete"
                      style={{ backgroundColor: Colors.pink, flex: 1 }}
                      onClick={() => {
                        confirm(
                          'Are you sure you want to delete this bib? Any race entries will also be deleted.'
                        )
                        return this.props.bib
                          .delete(bib._id)
                          .then(() =>
                            this.props.bib.loadBibsForSeries(seriesId)
                          )
                      }}
                    />
                  </HFlex>
                </VFlex>
              </HFlex>
            ))}
        </RootCell>
        <Footer />
      </>
    )
  }
}

export default Series
