import React from 'react'
import { inject, observer } from 'mobx-react'
import { HFlex, Input } from './Shared'
import Button from './Button'
import BibStore from '../stores/bib'
import RiderStore from '../stores/rider'
import Colors from '../Colors'

@inject('bib', 'rider')
@observer
export default class RentTransponder extends React.Component<{
  bibId: string
  onUpdated?: () => void
  bib?: BibStore
  rider?: RiderStore
}> {
  state = {
    rentalTransponder: '',
  }
  componentDidMount() {
    this.componentDidUpdate({})
  }
  componentDidUpdate(prevProps: any) {
    if (prevProps.bibId === this.props.bibId) return
    this.props.bib.loadIfNeeded(this.props.bibId).then(() => {
      const bib = this.props.bib.bibsById(this.props.bibId)
      return this.props.rider.loadIfNeeded(bib.riderId)
    })
  }
  render() {
    const bib = this.props.bib.bibsById(this.props.bibId)
    const rider = this.props.rider.ridersById(bib.riderId)
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
                  .then(() =>
                    Promise.all([
                      this.props.bib.loadById(bib._id),
                      this.props.rider.load(bib.riderId),
                    ])
                  )
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
                  if (rider.transponder) {
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
                    .then(() =>
                      Promise.all([
                        this.props.bib.loadById(bib._id),
                        this.props.rider.load(bib.riderId),
                      ])
                    )
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
