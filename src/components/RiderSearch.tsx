import React from 'react'
import { Input } from './shared'

export default class RiderSearch extends React.Component<{}> {
  render() {
    return (
      <Input
        type="text"
        placeholder="firstname, lastname, or license #"
        style={{ minWidth: 200 }}
        onChange={() => {}}
      />
    )
  }
}
