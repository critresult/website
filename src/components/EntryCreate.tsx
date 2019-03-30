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
  seriesId: string
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

  componentDidMount() {
    const race = this.props.race.racesById[this.props.raceId] || {}
    this.props.bib.loadBibsForSeries(race.seriesId)
  }

  render() {
    const race = this.props.race.racesById[this.props.raceId] || {}
    const bibsByRiderId = keyby(
      this.props.bib.bibsBySeriesId[race.seriesId] || [],
      'riderId'
    )
    return (
      <ModalContainer>
        <VFlex style={{ padding: 10 }}>
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
                    this.setState({ foundRiders: riders.slice(0, 5) })
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
          {this.state.foundRiders.map((rider: Rider) => (
            <HFlex key={rider._id} style={{ flexWrap: 'nowrap' }}>
              <VFlex style={{ alignItems: 'flex-start' }}>
                <HFlex>{`${rider.firstname} ${rider.lastname}`}</HFlex>
                <HFlex>{`License: ${rider.license}`}</HFlex>
                <HFlex>{`Transponder: ${rider.transponder || 'none'}`}</HFlex>
              </VFlex>
              <VFlex>
                {bibsByRiderId[rider._id] ? (
                  <HFlex>
                    Bib #{bibsByRiderId[rider._id].bibNumber}
                    <Button
                      title="Add Entry"
                      animating={this.state.isLoading}
                      onClick={() =>
                        this.props.race
                          .addEntry(
                            this.props.raceId,
                            rider._id,
                            bibsByRiderId[rider._id]._id
                          )
                          .then(() => this.props.race.load(this.props.raceId))
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
                        rider.bib = e.target.value
                      }}
                    />
                    <Button
                      animating={this.state.isLoading}
                      title="Add"
                      onClick={() =>
                        this.props.race
                          .addEntry(this.props.raceId, rider._id, rider.bib)
                          .then(() => {
                            this.props.race.load(this.props.raceId)
                            this.props.race.loadEntries(this.props.raceId)
                          })
                      }
                    />
                  </>
                )}
              </VFlex>
            </HFlex>
          ))}
          <HFlex>
            <Button
              title="Done"
              onClick={this.props.onFinished || (() => {})}
            />
          </HFlex>
        </VFlex>
      </ModalContainer>
    )
  }
}
export default EntryCreate
