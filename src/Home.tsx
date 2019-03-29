import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './components/Shared'
import Header from './components/Header'
import { inject, observer } from 'mobx-react'
import EventStore from './stores/event'
import Colors from './Colors'
import { TiPlus } from 'react-icons/ti'
import Popup from './components/Popup'
import Button from './components/Button'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Entrylist from './components/Entrylist'
import RiderStore from './stores/rider'
import SeriesCreate from './components/SeriesCreate'
import EventCreate from './components/EventCreate'

@inject('promoter', 'event', 'rider')
@observer
class Home extends React.Component<{
  event?: EventStore
  rider?: RiderStore
}> {
  state = {
    showingCreatePopup: false,
    showingCreateSeriesPopup: false,
    isLoading: false,
    eventData: {},
  }

  inputFileRef = React.createRef()

  componentDidMount() {
    this.props.event.loadUpcoming()
  }

  render() {
    return (
      <>
        <Header />
        <Popup visible={this.state.showingCreateSeriesPopup}>
          <SeriesCreate
            onCreated={() => this.setState({ showingCreateSeriesPopup: false })}
            onCancelled={() =>
              this.setState({ showingCreateSeriesPopup: false })
            }
          />
        </Popup>
        <Popup visible={this.state.showingCreatePopup}>
          <EventCreate
            onCreated={() => this.setState({ showingCreatePopup: false })}
            onCancelled={() => this.setState({ showingCreatePopup: false })}
          />
        </Popup>
        <VFlex style={{ flex: 1 }}>
          <div
            onClick={() => this.setState({ showingCreatePopup: true })}
            style={{
              borderRadius: 10,
              border: `${Colors.black} solid 2px`,
              backgroundColor: Colors.white,
              padding: 5,
              margin: 5,
              minWidth: 80,
              minHeight: 80,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <TiPlus color={Colors.black} size={70} />
          </div>
          <Button
            title="Create Series"
            onClick={() => {
              this.setState({ showingCreateSeriesPopup: true })
            }}
          />
          {this.props.event.upcomingEvents.map((_event) => {
            const event = this.props.event.eventsById[_event._id] || {}
            const races = event.races || []
            return (
              <VFlex
                key={_event._id}
                style={{
                  flex: 1,
                  backgroundColor: Colors.white,
                  boxShadow: `2px 2px 10px ${Colors.black}`,
                  padding: 15,
                  marginBottom: 10,
                  textAlign: 'center',
                  color: Colors.black,
                }}
              >
                <HFlex style={{ fontSize: 20 }}>{event.name}</HFlex>
                <HFlex>
                  {moment(event.startDate)
                    .utc()
                    .format("MMMM D 'YY")}
                </HFlex>
                {races.map((race: Race) => (
                  <Entrylist
                    key={race._id}
                    editable={false}
                    raceId={race._id}
                  />
                ))}
                <Link
                  style={{ textDecoration: 'none' }}
                  to={`/event/${event._id}`}
                >
                  <Button
                    style={{
                      backgroundColor: Colors.yellow,
                      color: Colors.black,
                    }}
                    title="View Details"
                  />
                </Link>
              </VFlex>
            )
          })}
          <input
            ref={this.inputFileRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(event) => {
              event.preventDefault()
              const reader = new FileReader()
              reader.onloadend = () => {
                const models = reader.result
                  .toString()
                  .split('\n')
                  .slice(1)
                  .map((row) => {
                    const [
                      license,
                      lastname,
                      firstname,
                      state,
                      postalCode,
                      gender,
                      racingAge,
                      racingCategoryRoad,
                      teamId,
                      teamName,
                      licenseExpirationDate,
                      licenseStatus,
                    ] = row.split(',')
                    return {
                      license,
                      lastname,
                      firstname,
                      state,
                      postalCode,
                      gender,
                      racingAge,
                      racingCategoryRoad,
                      teamId,
                      teamName,
                      licenseExpirationDate,
                      licenseStatus,
                    }
                  })
                this.props.rider.createMany(models)
              }
              reader.readAsText(event.target.files[0])
            }}
          />
          <Button
            title="Import Rider Data"
            onClick={() => {
              this.inputFileRef.current.click()
            }}
          />
          <input
            ref={this.inputFileRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(event) => {
              event.preventDefault()
              const reader = new FileReader()
              reader.onloadend = () => {
                const models = reader.result
                  .toString()
                  .split('\n')
                  .slice(1)
                  .map((row) => {
                    const [license, transponder] = row.split(',')
                    return {
                      transponder,
                      license,
                    }
                  })
                const updateAll = async () => {
                  let count = 0
                  for (const { license, transponder } of models) {
                    await this.props.rider.update({ license }, { transponder })
                    count++
                  }
                  console.log(count)
                }
                updateAll()
              }
              reader.readAsText(event.target.files[0])
            }}
          />
          <Button
            title="Import Transponder Data"
            onClick={() => {
              this.inputFileRef.current.click()
            }}
          />
        </VFlex>
      </>
    )
  }
}

export default Home
