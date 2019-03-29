import React from 'react'
import { inject, observer } from 'mobx-react'
import EventStore from '../stores/event'
import RaceStore, { Entry } from '../stores/race'
import styled from 'styled-components'
import { HFlex, VFlex } from './Shared'
import Button from './Button'
import Colors from '../Colors'
import Popup from './Popup'
import RiderCreate from './RiderCreate'
import TabSelector from './TabSelector'
import RiderFind from './RiderFind'

const EntryCell = styled(HFlex)`
  min-height: 40px;
  border-bottom: solid 1px ${Colors.black};
  flex-wrap: nowrap;
  flex: 1;
  justify-content: space-between;
  min-width: 600px;
`

const CellContent = styled(VFlex)`
  margin-left: 10px;
  margin-right: 10px;
  min-width: 80px;
`

@inject('event', 'race')
@observer
class Entrylist extends React.Component<{
  raceId: string
  editable?: boolean
  event?: EventStore
  race?: RaceStore
}> {
  state = {
    createEntryVisible: false,
  }
  componentDidMount() {
    this.props.race.loadEntries(this.props.raceId)
    this.props.race.load(this.props.raceId)
  }

  render() {
    const race = this.props.race.racesById[this.props.raceId] || {}
    const entries = this.props.race.entriesByRaceId[this.props.raceId] || []
    const tabs = [
      {
        title: 'Find Rider',
        render: () => (
          <RiderFind
            raceId={this.props.raceId}
            onFinished={() => this.setState({ createEntryVisible: false })}
          />
        ),
      },
      {
        title: 'Create Rider',
        render: () => (
          <RiderCreate
            onCreated={() => this.setState({ createEntryVisible: false })}
            onCancelled={() => this.setState({ createEntryVisible: false })}
          />
        ),
      },
    ]
    return (
      <VFlex
        style={{
          margin: 8,
          padding: 8,
          borderRadius: 10,
          backgroundColor: 'white',
        }}
      >
        <Popup visible={this.state.createEntryVisible}>
          <TabSelector tabs={tabs} />
        </Popup>
        <EntryCell style={{ justifyContent: 'center' }}>
          {race.name} - {`${(race.entries || []).length} entries`}
        </EntryCell>
        <EntryCell>
          <CellContent style={{ alignItems: 'flex-start' }}>Name</CellContent>
          <CellContent>Bib #</CellContent>
          <CellContent>USAC License</CellContent>
          <CellContent>Transponder</CellContent>
          {this.props.editable === false ? null : <CellContent />}
        </EntryCell>
        {entries.map((entry: Entry) => (
          <EntryCell key={entry._id}>
            <CellContent style={{ alignItems: 'flex-start' }}>{`${
              entry.rider.firstname
            } ${entry.rider.lastname}`}</CellContent>
            <CellContent>{entry.bib}</CellContent>
            <CellContent>{entry.rider.license}</CellContent>
            <CellContent>{entry.rider.transponder || 'none'}</CellContent>
            {this.props.editable === false ? null : (
              <CellContent style={{ alignItems: 'flex-end' }}>
                <Button
                  title="Remove"
                  style={{ backgroundColor: Colors.pink }}
                  onClick={() => {
                    this.props.race
                      .removeRider(this.props.raceId, entry.riderId)
                      .then(() =>
                        this.props.race.loadEntries(this.props.raceId)
                      )
                  }}
                />
              </CellContent>
            )}
          </EntryCell>
        ))}
        {this.props.editable === false ? null : (
          <Button
            title="Add Entry"
            onClick={() => {
              this.setState({ createEntryVisible: true })
            }}
          />
        )}
      </VFlex>
    )
  }
}

export default Entrylist
