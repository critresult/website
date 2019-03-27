import styled from 'styled-components';
import Colors from '../Colors';

export const VFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const HFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Cell = styled.div`
  background-color: ${Colors.white};
`;
