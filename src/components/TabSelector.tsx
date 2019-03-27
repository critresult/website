import React from 'react'
import Colors from '../Colors'
import { inject, observer } from 'mobx-react'
import { VFlex } from './Shared'

@inject()
@observer
class TabSelector extends React.Component<{
  tabs: { title: string }[]
  onIndexChange?: (activeIndex: number) => void
}> {
  state = {
    activeIndex: 0,
  }

  render() {
    return (
      <>
        {this.props.tabs.map((tab: { title: string }, index: number) => (
          <VFlex
            onClick={() => {
              this.setState({ activeIndex: index })
            }}
            style={{
              backgroundColor:
                this.state.activeIndex === index ? Colors.blue : Colors.white,
              color:
                this.state.activeIndex === index ? Colors.white : Colors.black,
              minWidth: 100,
              padding: 10,
              cursor: 'pointer',
            }}
          >
            {tab.title}
          </VFlex>
        ))}
      </>
    )
  }
}

export default TabSelector
