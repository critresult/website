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
import SeriesStore, { Series } from './stores/series'
import SeriesCreate from './components/SeriesCreate'
import EventCreate from './components/EventCreate'
import styled from 'styled-components'

const Cell = styled(VFlex)`
  flex: 1;
  background-color: ${Colors.white};
  box-shadow: 2px 2px 10px ${Colors.black};
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  color: ${Colors.black};
`

@inject('promoter', 'event', 'rider', 'series')
@observer
class Home extends React.Component<{
  event?: EventStore
  rider?: RiderStore
  series?: SeriesStore
}> {
  state = {
    showingCreatePopup: false,
    showingCreateSeriesPopup: false,
  }

  inputFileRef = React.createRef()

  componentDidMount() {
    this.props.event.loadUpcoming()
    this.props.series.load()
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
        <HFlex
          style={{
            borderBottom: `solid 2px ${Colors.black}`,
            backgroundColor: Colors.black,
            justifyContent: 'space-between',
            fontSize: 20,
          }}
        >
          <VFlex style={{ margin: 8, color: Colors.white }}>
            <HFlex>
              Active Series
              <Button
                title={''}
                onClick={() => {
                  this.setState({ showingCreateSeriesPopup: true })
                }}
                style={{ minWidth: 0, backgroundColor: Colors.white }}
              >
                <TiPlus color={Colors.black} size={23} />
              </Button>
              {this.props.series.all.map((series: Series, index) => (
                <Button
                  key={index}
                  title={series.name}
                  style={{ backgroundColor: Colors.white, color: Colors.black }}
                  onClick={() => {
                    this.props.history.push(`/series/${series._id}`)
                  }}
                />
              ))}
            </HFlex>
          </VFlex>
          <VFlex>
            <Button
              title="Create Event"
              onClick={() => {
                this.setState({ showingCreatePopup: true })
              }}
              style={{ backgroundColor: Colors.green }}
            />
          </VFlex>
        </HFlex>
        <VFlex style={{ flex: 1 }}>
          {this.props.event.upcomingEvents.map((_event) => {
            const event = this.props.event.eventsById[_event._id] || {}
            const races = event.races || []
            return (
              <Cell key={_event._id}>
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
              </Cell>
            )
          })}
        </VFlex>
      </>
    )
  }
}

// const importLogic = () => (
//   <>
//     <input
//       ref={this.inputFileRef}
//       type="file"
//       style={{ display: 'none' }}
//       onChange={(event) => {
//         event.preventDefault()
//         const reader = new FileReader()
//         reader.onloadend = () => {
//           const models = reader.result
//             .toString()
//             .split('\n')
//             .slice(1)
//             .map((row) => {
//               const [
//                 license,
//                 lastname,
//                 firstname,
//                 state,
//                 postalCode,
//                 gender,
//                 racingAge,
//                 racingCategoryRoad,
//                 teamId,
//                 teamName,
//                 licenseExpirationDate,
//                 licenseStatus,
//               ] = row.split(',')
//               return {
//                 license,
//                 lastname,
//                 firstname,
//                 state,
//                 postalCode,
//                 gender,
//                 racingAge,
//                 racingCategoryRoad,
//                 teamId,
//                 teamName,
//                 licenseExpirationDate,
//                 licenseStatus,
//               }
//             })
//           this.props.rider.createMany(models)
//         }
//         reader.readAsText(event.target.files[0])
//       }}
//     />
//     <Button
//       title="Import Rider Data"
//       onClick={() => {
//         this.inputFileRef.current.click()
//       }}
//     />
//     <input
//       ref={this.inputFileRef}
//       type="file"
//       style={{ display: 'none' }}
//       onChange={(event) => {
//         event.preventDefault()
//         const reader = new FileReader()
//         reader.onloadend = () => {
//           const models = reader.result
//             .toString()
//             .split('\n')
//             .slice(1)
//             .map((row) => {
//               const [license, transponder] = row.split(',')
//               return {
//                 transponder,
//                 license,
//               }
//             })
//           const updateAll = async () => {
//             let count = 0
//             for (const { license, transponder } of models) {
//               await this.props.rider.update({ license }, { transponder })
//               count++
//             }
//             console.log(count)
//           }
//           updateAll()
//         }
//         reader.readAsText(event.target.files[0])
//       }}
//     />
//     <Button
//       title="Import Transponder Data"
//       onClick={() => {
//         this.inputFileRef.current.click()
//       }}
//     />
//   </>
// )

export default Home
