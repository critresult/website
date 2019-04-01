import React from 'react'
import { observer, inject } from 'mobx-react'
import { VFlex, HFlex, Input, LargeText } from './Shared'
import Button from './Button'
import Colors from '../Colors'
import idx from 'idx'

@inject('bib')
@observer
class BibList extends React.Component<{
  seriesId: string
  title?: string
  bib?: any
}> {
  state = {
    filteredBibs: null,
    bibFilter: '',
  }
  filterBibs = () => {
    const { seriesId } = this.props
    const bibs = this.props.bib.bibsBySeriesId[seriesId] || []
    if (!this.state.bibFilter) {
      this.setState({ filteredBibs: null })
      return
    }
    this.setState({
      filteredBibs: bibs.filter(
        (bib) => bib.bibNumber.toString().indexOf(this.state.bibFilter) !== -1
      ),
    })
  }

  render() {
    const bibs = this.props.bib.bibsBySeriesId[this.props.seriesId] || []
    return (
      <>
        <VFlex>
          <LargeText>
            {this.props.title || `Active Bibs (${bibs.length})`}
          </LargeText>
        </VFlex>
        <HFlex style={{ justifyContent: 'center' }}>
          <Input
            placeholder="filter by bib"
            type="text"
            onChange={(e: any) => {
              this.setState(
                {
                  bibFilter: e.target.value,
                },
                this.filterBibs
              )
            }}
          />
        </HFlex>
        <HFlex style={{ justifyContent: 'space-between', margin: 16 }}>
          <VFlex style={{ minWidth: '15%' }}>Bib #</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Firstname</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Lastname</VFlex>
          <VFlex style={{ minWidth: '15%' }}>License</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Transponder</VFlex>
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
              <VFlex style={{ minWidth: '15%' }}>{bib.bibNumber}</VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {idx(bib, (_: any) => _.rider.firstname)}
              </VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {idx(bib, (_: any) => _.rider.lastname)}
              </VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {idx(bib, (_: any) => _.rider.license) || 'One Day'}
              </VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {idx(bib, (_: any) => _.rider.transponder) || 'none'}
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