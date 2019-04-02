import React from 'react'
import { observer, inject } from 'mobx-react'
import { VFlex, HFlex, Input, LargeText } from './Shared'
import Button from './Button'
import Colors from '../Colors'
import idx from 'idx'
import RiderEdit from './RiderEdit'
import Popup from './Popup'

@inject('bib', 'rider')
@observer
class BibList extends React.Component<{
  seriesId: string
  title?: string
  bib?: any
  rider?: any
}> {
  state = {
    filteredBibs: null as null | any[],
    filter: '',
    showingRiderEditPopup: false,
    editRiderId: '',
    rentalTransponderByRiderId: {},
  }

  filterBibs = () => {
    const { seriesId } = this.props
    const bibs = this.props.bib.bibsBySeriesId[seriesId] || []
    if (!this.state.filter) {
      this.setState({ filteredBibs: null })
      return
    }
    this.setState({
      filteredBibs: bibs.filter((bib: any) => {
        const license = idx<any, string>(bib, (_) => _.rider.license) || ''
        const firstname = idx<any, string>(bib, (_) => _.rider.firstname) || ''
        const lastname = idx<any, string>(bib, (_) => _.rider.lastname) || ''
        const bibMatch =
          bib.bibNumber.toString().indexOf(this.state.filter) !== -1
        const licenseMatch = license.indexOf(this.state.filter) !== -1
        const firstnameMatch = firstname.indexOf(this.state.filter) !== -1
        const lastnameMatch = lastname.indexOf(this.state.filter) !== -1
        return bibMatch || licenseMatch || firstnameMatch || lastnameMatch
      }),
    })
  }

  render() {
    const bibs = this.props.bib.bibsBySeriesId[this.props.seriesId] || []
    return (
      <>
        <Popup visible={this.state.showingRiderEditPopup}>
          <RiderEdit
            riderId={this.state.editRiderId}
            onCancelled={() => {
              this.setState({
                showingRiderEditPopup: false,
              })
            }}
            onUpdated={() => {
              this.setState({
                showingRiderEditPopup: false,
              })
            }}
          />
        </Popup>
        <VFlex>
          <LargeText>
            {this.props.title || `Active Bibs (${bibs.length})`}
          </LargeText>
        </VFlex>
        <HFlex style={{ justifyContent: 'center' }}>
          <Input
            placeholder="bib #, name, or license #"
            type="text"
            onChange={(e: any) => {
              this.setState(
                {
                  filter: e.target.value,
                },
                this.filterBibs
              )
            }}
          />
        </HFlex>
        <HFlex style={{ justifyContent: 'space-between', margin: 16 }}>
          <VFlex style={{ minWidth: '5%' }}>Bib #</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Firstname</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Lastname</VFlex>
          <VFlex style={{ minWidth: '10%' }}>License</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Transponder</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Renting Transponder</VFlex>
          <VFlex style={{ flex: 1 }} />
        </HFlex>
        {(this.state.filteredBibs || bibs)
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
              <VFlex style={{ minWidth: '5%' }}>{bib.bibNumber}</VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {idx(bib, (_: any) => _.rider.firstname)}
              </VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {idx(bib, (_: any) => _.rider.lastname)}
              </VFlex>
              <VFlex style={{ minWidth: '10%' }}>
                {idx(bib, (_: any) => _.rider.license) || 'One Day'}
              </VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {idx(bib, (_: any) => _.rider.transponder) || 'none'}
              </VFlex>
              <VFlex style={{ minWidth: '15%' }}>
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
                            this.props.bib.loadBibsForSeries(bib.seriesId)
                          )
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
                            rentalTransponderByRiderId: {
                              ...this.state.rentalTransponderByRiderId,
                              [bib.riderId]: e.target.value,
                            },
                          })
                        }}
                      />
                      <Button
                        title="Rent"
                        onClick={() => {
                          const transponder = this.state
                            .rentalTransponderByRiderId[bib.riderId]
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
                            .then(() =>
                              this.props.bib.loadBibsForSeries(bib.seriesId)
                            )
                        }}
                      />
                    </HFlex>
                  )}
                </HFlex>
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
                    onClick={() => {
                      this.setState({
                        showingRiderEditPopup: true,
                        editRiderId: bib.riderId,
                      })
                    }}
                  />
                  <Button
                    title="Delete"
                    style={{ backgroundColor: Colors.pink, flex: 1 }}
                    onClick={() => {
                      if (
                        !confirm(
                          'Are you sure you want to delete this bib? Any race entries will also be deleted.'
                        )
                      ) return
                      return this.props.bib
                        .delete(bib._id)
                        .then(() =>
                          this.props.bib.loadBibsForSeries(this.props.seriesId)
                        )
                        .then(this.filterBibs)
                    }}
                  />
                </HFlex>
              </VFlex>
            </HFlex>
          ))}
      </>
    )
  }
}
export default BibList
