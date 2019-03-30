import React from 'React'
import { inject, observer } from 'mobx-react'
import { HFlex, VFlex } from './components/Shared'
import SeriesStore from './stores/series'
import Header from './components/Header'

@inject('series', 'event', 'rider')
@observer
class Series extends React.Component<{
  series?: SeriesStore
}> {
  componentDidMount() {
    const seriesId = this.props.match.params.id
    this.props.series.load(seriesId)
  }
  render() {
    const seriesId = this.props.match.params.id
    const series = this.props.series.seriesById[seriesId] || {}
    return (
      <>
        <Header />
        <div>{series.name}</div>
      </>
    )
  }
}

export default Series
