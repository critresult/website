import React from 'react'
import { inject, observer } from 'mobx-react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import RiderStore, { Rider } from '../stores/rider'
import RaceStore from '../stores/race'

@inject('rider', 'race')
@observer
class RiderFind extends React.Component<{
  raceId: string
  onFinished?: () => void
  rider?: RiderStore
  race?: RaceStore
}> {
  state = {
    isLoading: false,
    isSearching: false,
    foundRiders: [] as Rider[],
  }
  render() {
    return (
      <VFlex>
        <HFlex style={{ borderRadius: 5 }}>
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
                    <HFlex>{`Transponder: ${rider.transponder ||
                      'none'}`}</HFlex>
                  </VFlex>
                  <VFlex>
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
                      onClick={() => {
                        this.props.race
                          .addRider(this.props.raceId, rider._id, rider.bib)
                          .then(() => {
                            this.props.race.load(this.props.raceId)
                            this.props.race.loadEntries(this.props.raceId)
                          })
                      }}
                    />
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
        </HFlex>
      </VFlex>
    )
  }
}
export default RiderFind
