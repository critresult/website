import React from 'react'
import { inject, observer } from 'mobx-react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import RiderStore, { Rider } from '../stores/rider'

@inject('rider')
@observer
class RiderFind extends React.Component<{
  onFinished?: () => void
  rider?: RiderStore
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
                        this.setState({ foundRiders: riders })
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
                <HFlex key={rider._id} style={{ flexWrap: 'nowrap'}}>
                  <div>
                    {`${rider.firstname} ${rider.lastname} - ${rider.license}`}
                  </div>
                  <Button
                    animating={this.state.isLoading}
                    title="Add"
                    onClick={() => {}}
                  />
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
