import React from 'react'
import PromoterStore from '../stores/promoter'
import { inject, observer } from 'mobx-react'
import { TiPlus } from 'react-icons/ti'

@inject('promoter')
@observer
class EventCell extends React.Component<{
  id: string
  promoter?: PromoterStore
}> {
  render() {
    return (<div></div>)
  }
}

export default EventCell
