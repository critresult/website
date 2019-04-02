import React from 'react'
import { inject, observer } from 'mobx-react'
import { HFlex, Input } from './Shared'
import Button from './Button'
import BibStore, { Bib } from '../stores/bib'
import RiderStore from '../stores/rider'
import Colors from '../Colors'
import idx from 'idx'

@inject('bib', 'rider')
@observer
class RentTransponder extends React.Component<{
  bibId: string
  onUpdated?: () => void
  bib?: BibStore
  rider?: RiderStore
}> {
  state = {
    rentalTransponder: '',
  }
  render() {
    const bib = this.props.bib.bibsById[this.props.bibId] || ({} as Bib)
    return (
      <>
        <HFlex>
          {bib.hasRentalTransponder ? (
            <Button
              title="Return"
              style={{ backgroundColor: Colors.green }}
              onClick={() =>
                this.props.rider
                  .update(bib.riderId, {
                    transponder: '',
                  })
                  .then(() =>
                    this.props.bib.update(bib._id, {
                      hasRentalTransponder: false,
                    })
                  )
                  .then(() => this.props.bib.loadById(bib._id))
                  .then(() => this.setState({ rentalTransponder: '' }))
                  .then(this.props.onUpdated || (() => {}))
              }
            />
          ) : (
            <HFlex>
              <Input
                type="text"
                placeholder="Transponder ID"
                style={{ minWidth: 20 }}
                onChange={(e: any) => {
                  this.setState({
                    rentalTransponder: e.target.value,
                  })
                }}
                value={this.state.rentalTransponder}
              />
              <Button
                title="Rent"
                onClick={() => {
                  const transponder = this.state.rentalTransponder
                  if (!transponder) return
                  if (idx(bib, (_: any) => _.rider.transponder)) {
                    const confirmed = confirm(
                      'This rider already has a transponder. Overwrite?'
                    )
                    if (!confirmed) return
                  }
                  return this.props.rider
                    .update(bib.riderId, {
                      transponder,
                    })
                    .then(() =>
                      this.props.bib.update(bib._id, {
                        hasRentalTransponder: true,
                      })
                    )
                    .then(() => this.props.bib.loadById(bib._id))
                    .then(() => this.setState({ rentalTransponder: '' }))
                    .then(this.props.onUpdated || (() => {}))
                }}
              />
            </HFlex>
          )}
        </HFlex>
      </>
    )
  }
}
export default RentTransponder
