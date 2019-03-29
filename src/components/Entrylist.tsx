import React from 'react'
import { inject, observer } from 'mobx-react'
import EventStore from '../stores/event'
import RaceStore from '../stores/race'
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
  width: 100%;
`
@inject('event', 'race')
@observer
class Entrylist extends React.Component<{
  raceId: string
  event?: EventStore
  race?: RaceStore
}> {
  state = {
    createEntryVisible: false,
  }
  componentDidMount() {
    this.props.race.load(this.props.raceId)
  }

  render() {
    const race = this.props.race.racesById[this.props.raceId] || {}
    const entries = race.entries || []
    const tabs = [
      {
        title: 'Find Rider',
        render: () => (
          <RiderFind
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
      <>
        <Popup visible={this.state.createEntryVisible}>
          <TabSelector tabs={tabs} />
        </Popup>
        <VFlex
          style={{
            margin: 8,
            padding: 8,
            borderRadius: 10,
            backgroundColor: 'white',
            flex: 1,
          }}
        >
          <EntryCell>
            {race.name} - {`${(race.entries || []).length} entries`}
          </EntryCell>
          {(race.entries || []).map((entry: any) => (
            <EntryCell>{entry.bib}</EntryCell>
          ))}
          <EntryCell style={{ justifyContent: 'flex-end' }}>
            <Button
              title="Add Entry"
              onClick={() => {
                this.setState({ createEntryVisible: true })
              }}
            />
          </EntryCell>
        </VFlex>
      </>
    )
  }
}

export default Entrylist
