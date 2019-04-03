import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import EventStore from '../stores/event'
import RiderStore from '../stores/rider'
import SeriesStore from '../stores/series'

@inject('event', 'race', 'series')
@observer
export default class SeriesCreate extends React.Component<{
  onCreated?: () => void
  onCancelled?: () => void
  series?: SeriesStore
  event?: EventStore
  rider?: RiderStore
}> {
  state = {
    name: '',
  }

  createSeries = () =>
    this.props.series
      .create({ name: this.state.name })
      .then(() => this.props.series.load())
      .then(() => (this.props.onCreated || (() => {}))())

  render() {
    return (
      <ModalContainer>
        <VFlex style={{ padding: 10 }}>
          <HFlex>
            Series Name:{' '}
            <Input
              valid
              type="text"
              onChange={(e: any) => {
                this.setState({
                  name: e.target.value,
                })
              }}
            />
          </HFlex>
          <HFlex>
            <Button title="Create Series" onClick={this.createSeries} />
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
