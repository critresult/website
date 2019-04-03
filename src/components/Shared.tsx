import styled from 'styled-components'
import Colors from '../Colors'

export const VFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const HFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
`

export const Input = styled.input<{ valid?: boolean }>`
  margin: 5px;
  padding: 5px;
  background-color: transparent;
  border-radius: 8px;
  border: solid 2px
    ${(props) => {
      if (props.valid === true) {
        return Colors.green
      } else if (props.valid === false) {
        return Colors.blue
      }
      return Colors.black
    }};
  box-shadow: none;
  outline-width: 0px;
  min-width: 200px;
`

export const ModalContainer = styled.div`
  background-color: ${Colors.white};
  border-radius: 5px;
  border-color: rgba(0, 0, 0, 0.15);
  min-width: 300px;
  min-height: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const LargeText = styled.div`
  font-size: 20px;
  margin: 8px;
`

export const TitleText = styled.div`
  font-size: 25px;
  margin: 8px;
`

export const RootCell = styled.div`
  background-color: ${Colors.white};
  margin: auto;
  margin-top: 8px;
  max-width: 1000px;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 1px 2px ${Colors.shadow};
`
