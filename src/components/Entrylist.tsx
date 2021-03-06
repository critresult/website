import React from 'react'
import { inject, observer } from 'mobx-react'
import EventStore from '../stores/event'
import RaceStore, { Race } from '../stores/race'
import { Entry } from '../stores/entry'
import styled from 'styled-components'
import { HFlex, VFlex, LargeText } from './Shared'
import Button from './Button'
import Colors from '../Colors'
import Popup from './Popup'
import RiderCreate from './RiderCreate'
import TabSelector from './TabSelector'
import EntryCreate from './EntryCreate'
import { TiTimes } from 'react-icons/ti'
import RentTransponder from './RentTransponder'
import BibStore from '../stores/bib'
import { withRouter } from 'react-router-dom'
import LoadingIndicator from './LoadingIndicator'
import RiderStore from '../stores/rider'
import RiderEdit from './RiderEdit'

const EntryCell = styled(HFlex)`
  min-height: 40px;
  border-bottom: solid 1px ${Colors.black};
  flex-wrap: nowrap;
  flex: 1;
  justify-content: space-between;
  min-width: 600px;
`

@inject('event', 'race', 'bib', 'rider')
@observer
class Entrylist extends React.Component<{
  seriesId: string
  raceId: string
  editable?: boolean
  event?: EventStore
  race?: RaceStore
  bib?: BibStore
  rider?: RiderStore
}> {
  state = {
    createEntryVisible: false,
    exportingCSV: false,
    loading: true,
    editRiderVisible: false,
    editRiderId: '',
  }
  componentDidMount() {
    this.componentDidUpdate({})
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.raceId === this.props.raceId) return
    this.setState({ loading: true })
    this.props.race
      .loadEntries(this.props.raceId)
      .then(() => this.setState({ loading: false }))
      .catch((err) => {
        this.setState({ loading: false })
        throw err
      })
  }

  exportCSV = () => {
    this.setState({ exportingCSV: true })
    const race = this.props.race.racesById(this.props.raceId)
    this.props.race
      .loadEntries(this.props.raceId)
      .then(() => {
        const entries = this.props.race.entriesByRaceId(this.props.raceId)
        const rows = entries.map((entry: Entry) =>
          [
            entry.rider.license,
            'ANN',
            entry.bib.bibNumber,
            '',
            entry.rider.transponder,
            race.name,
            entry.rider.firstname,
            entry.rider.lastname,
            entry.rider.teamName,
          ].join(', ')
        )
        rows.unshift(
          [
            'RacerId',
            'Type',
            'Bib',
            'RentalID',
            'Transponder',
            'Event',
            'FirstName',
            'LastName',
            'Team',
          ].join(',')
        )
        const csvContent = `data:text/csv;charset=utf-8,${rows.join('\r\n')}`
        const link = document.createElement('a')
        link.setAttribute('href', csvContent)
        link.setAttribute('download', 'race_data.csv')
        document.body.appendChild(link) // Required for FF
        link.click()
        this.setState({ exportingCSV: false })
      })
      .catch(() => this.setState({ exportingCSV: false }))
  }

  render() {
    const race = this.props.race.racesById(this.props.raceId)
    const entries = this.props.race.entriesByRaceId(this.props.raceId)
    const tabs = [
      {
        title: 'Find Rider',
        render: () => (
          <EntryCreate
            raceId={this.props.raceId}
            onFinished={() => this.setState({ createEntryVisible: false })}
          />
        ),
      },
      {
        title: 'Create Rider',
        render: () => (
          <RiderCreate
            seriesId={this.props.seriesId}
            raceId={this.props.raceId}
            onCreated={() => this.setState({ createEntryVisible: false })}
            onCancelled={() => this.setState({ createEntryVisible: false })}
          />
        ),
      },
    ]
    return (
      <>
        <Popup visible={this.state.createEntryVisible}>
          <TabSelector tabs={tabs} />
        </Popup>
        <Popup visible={this.state.editRiderVisible}>
          <RiderEdit
            riderId={this.state.editRiderId}
            seriesId={this.props.seriesId}
            onCancelled={() => {
              this.setState({
                editRiderVisible: false,
              })
            }}
            onUpdated={() => {
              this.setState({
                editRiderVisible: false,
              })
            }}
          />
        </Popup>
        <EntryCell
          style={{
            justifyContent: 'space-between',
            alignItems: 'space-between',
          }}
        >
          <Button
            title="View Results"
            onClick={() => {
              this.props.history.push(`/race/${this.props.raceId}`)
            }}
          />
          <LargeText>
            {race.name} - {`${entries.length} entries`}
          </LargeText>
          <Button
            title="Add Entry"
            style={{ backgroundColor: Colors.green }}
            onClick={() => {
              this.setState({ createEntryVisible: true })
            }}
          />
        </EntryCell>
        <EntryCell>
          <VFlex style={{ minWidth: '5%' }}>Bib #</VFlex>
          <VFlex style={{ minWidth: '15%' }}>First Name</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Last Name</VFlex>
          <VFlex style={{ minWidth: '10%' }}>License #</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Transponder</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Rental Transponder</VFlex>
          {this.props.editable === false ? null : <VFlex style={{ flex: 1 }} />}
        </EntryCell>
        {this.state.loading ? (
          <LoadingIndicator />
        ) : (
          entries.map((entry: Entry) => {
            const bib = this.props.bib.bibsById(entry.bibId)
            const rider = this.props.rider.ridersById(entry.riderId)
            return (
              <EntryCell key={entry._id}>
                <VFlex style={{ minWidth: '5%' }}>{bib.bibNumber}</VFlex>
                <VFlex style={{ minWidth: '15%' }}>{rider.firstname}</VFlex>
                <VFlex style={{ minWidth: '15%' }}>{rider.lastname}</VFlex>
                <VFlex style={{ minWidth: '10%' }}>
                  {rider.license || 'One Day'}
                </VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  {rider.transponder || 'none'}
                </VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  <RentTransponder
                    bibId={entry.bibId}
                    onUpdated={() =>
                      this.props.bib.loadBibsForSeries(race.seriesId)
                    }
                  />
                </VFlex>
                {this.props.editable === false ? null : (
                  <VFlex style={{ flex: 1 }}>
                    <HFlex>
                      <Button
                        title="Edit"
                        style={{
                          color: Colors.black,
                          backgroundColor: Colors.yellow,
                        }}
                        onClick={() => {
                          this.setState({
                            editRiderId: rider._id,
                            editRiderVisible: true,
                          })
                        }}
                      />
                      <Button
                        style={{ maxHeight: 20, backgroundColor: Colors.pink }}
                        onClick={() => {
                          if (!confirm('Remove this entry?')) return
                          return this.props.race
                            .removeEntry(this.props.raceId, entry.riderId)
                            .then(() =>
                              this.props.race.loadEntries(this.props.raceId)
                            )
                        }}
                      >
                        <TiTimes size={20} color={Colors.white} />
                      </Button>
                    </HFlex>
                  </VFlex>
                )}
              </EntryCell>
            )
          })
        )}
        <HFlex>
          <HFlex>
            <Button
              animating={this.state.exportingCSV}
              title="Export CSV"
              onClick={this.exportCSV}
            />
            <Button
              title="Delete Race"
              style={{ backgroundColor: Colors.pink }}
              onClick={() => {
                if (!confirm('Delete this race?')) return
                return this.props.race
                  .delete(this.props.raceId)
                  .then(() =>
                    Promise.all([
                      this.props.event.loadRacesByEventId(race.eventId),
                      this.props.event.load(race.eventId),
                    ])
                  )
              }}
            />
          </HFlex>
          <Button title="Add Entry" style={{ opacity: 0 }} onClick={() => {}} />
        </HFlex>
      </>
    )
  }
}

export default withRouter(Entrylist)
