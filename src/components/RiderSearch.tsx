import React from 'react'
import { Input } from './shared'
import RiderStore from '../stores/rider'
import { inject, observer } from 'mobx-react'

@inject('rider')
@observer
export default class RiderSearch extends React.Component<{
  ridersChanged: (riders: any[]) => any
  rider?: RiderStore
}> {
  state = {
    isSearching: false,
  }
  searchRef = React.createRef<any>()

  searchChanged = (e: any) => {
    const newSearchString = e.target.value
    if (newSearchString.length === 0) {
      this.props.ridersChanged([])
      this.setState({ isSearching: false })
      return
    }
    this.props.ridersChanged([])
    this.setState({ isSearching: true })
    this.props.rider
      .search(newSearchString)
      .then((riders) => {
        if (this.searchRef.current.value !== newSearchString) return
        this.setState({ isSearching: false })
        this.props.ridersChanged(riders)
      })
      .catch(() => this.setState({ isSearching: false }))
  }

  render() {
    return (
      <>
        <Input
          ref={this.searchRef}
          type="text"
          placeholder="firstname, lastname, or license #"
          style={{ minWidth: 200 }}
          onChange={this.searchChanged}
        />
        {this.state.isSearching ? (
          <img
            src={require('../../static/puff.svg')}
            height="15"
            style={{ filter: 'brightness(0)' }}
          />
        ) : null}
      </>
    )
  }
}
