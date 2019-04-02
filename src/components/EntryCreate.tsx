import React from 'react'
import { inject, observer } from 'mobx-react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import RiderStore, { Rider } from '../stores/rider'
import RaceStore from '../stores/race'
import BibStore from '../stores/bib'
import keyby from 'lodash.keyby'

@inject('rider', 'race', 'bib')
@observer
class EntryCreate extends React.Component<{
  raceId: string
  onFinished?: () => void
  rider?: RiderStore
  race?: RaceStore
  bib?: BibStore
}> {
  state = {
    isLoading: false,
    isSearching: false,
    foundRiders: [] as Rider[],
  }

  searchRef = React.createRef()

  componentDidMount() {
    const race = this.props.race.racesById[this.props.raceId] || {}
    this.props.bib.loadBibsForSeries(race.seriesId)
    this.searchRef.current.focus()
  }

  render() {
    const race = this.props.race.racesById[this.props.raceId] || {}
    const bibsByRiderId = keyby(
      this.props.bib.bibsBySeriesId[race.seriesId] || [],
      'riderId'
    )
    return (
      <ModalContainer>
        <HFlex>
          Search:{' '}
          <Input
            ref={this.searchRef}
            valid
            type="text"
            placeholder="firstname, lastname, or license #"
            style={{ minWidth: 200 }}
            onChange={(e: any) => {
              // Only search once three or more characters are entered
              if (e.target.value.length < 3) return
              this.setState({ isSearching: true })
              this.props.rider
                .search(e.target.value)
                .then((riders) => {
                  this.setState({ isSearching: false })
                  this.setState({ foundRiders: riders.slice(0, 100) })
                })
                .catch(() => this.setState({ isSearching: false }))
            }}
          />
          {this.state.isSearching ? (
            <img
              src={require('../../static/puff.svg')}
              height="15"
              style={{ filter: 'brightness(0)' }}
            />
          ) : null}
        </HFlex>
        <VFlex style={{ maxHeight: 500, overflowY: 'scroll' }}>
          {this.state.foundRiders.map((rider: Rider) => (
            <HFlex
              key={rider._id}
              style={{
                marginTop: 8,
                justifyContent: 'space-between',
                flexWrap: 'nowrap',
              }}
            >
              <VFlex style={{ alignItems: 'flex-start' }}>
                <HFlex>{`${rider.firstname} ${rider.lastname}`}</HFlex>
                <HFlex>{`Category: ${rider.racingCategoryRoad}`}</HFlex>
                <HFlex>{`License: ${rider.license}`}</HFlex>
                <HFlex>{`Transponder: ${rider.transponder || 'none'}`}</HFlex>
                <HFlex>{`Team: ${rider.teamName}`}</HFlex>
              </VFlex>
              <VFlex>
                {bibsByRiderId[rider._id] ? (
                  <HFlex>
                    Bib #{bibsByRiderId[rider._id].bibNumber}
                    <Button
                      title="Add Entry"
                      onClick={() =>
                        this.props.race
                          .addEntry(
                            this.props.raceId,
                            rider._id,
                            bibsByRiderId[rider._id]._id
                          )
                          .then(() =>
                            Promise.all([
                              this.props.race.load(this.props.raceId),
                              this.props.race.loadEntries(this.props.raceId),
                            ])
                          )
                          .then(() => {
                            this.searchRef.current.value = ''
                            this.searchRef.current.focus()
                            this.setState({ foundRiders: [] })
                          })
                      }
                    />
                  </HFlex>
                ) : (
                  <>
                    <Input
                      valid
                      type="text"
                      placeholder="Bib Number"
                      onChange={(e: any) => {
                        rider.__bib = e.target.value
                      }}
                    />
                    <Button
                      animating={this.state.isLoading}
                      title="Add"
                      onClick={() =>
                        this.props.bib
                          .create({
                            bibNumber: rider.__bib,
                            riderId: rider._id,
                            seriesId: race.seriesId,
                          })
                          .then((bib) =>
                            this.props.race.addEntry(
                              this.props.raceId,
                              rider._id,
                              bib._id
                            )
                          )
                          .then(() =>
                            Promise.all([
                              this.props.race.load(this.props.raceId),
                              this.props.race.loadEntries(this.props.raceId),
                              this.props.bib.loadBibsForSeries(race.seriesId),
                            ])
                          )
                          .then(() => {
                            this.searchRef.current.value = ''
                            this.searchRef.current.focus()
                            this.setState({ foundRiders: [] })
                          })
                      }
                    />
                  </>
                )}
              </VFlex>
            </HFlex>
          ))}
        </VFlex>
        <HFlex>
          <Button title="Done" onClick={this.props.onFinished || (() => {})} />
        </HFlex>
      </ModalContainer>
    )
  }
}
export default EntryCreate
