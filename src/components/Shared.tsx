import styled from 'styled-components'
import Colors from '../Colors'

export const VFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
`

export const HFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

export const Input = styled.input<{ valid?: boolean }>`
  margin: 5px;
  padding: 5px;
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline-width: 0px;
  border-bottom: 1px solid ${(p) => (!p.valid ? Colors.pink : Colors.blue)};
`

export const ModalContainer = styled.div`
  background-color: ${Colors.white};
  border-radius: 5px;
  border-color: rgba(0, 0, 0, 0.15);
  width: 300px;
  min-height: 200px;
  padding: 10px;
`
