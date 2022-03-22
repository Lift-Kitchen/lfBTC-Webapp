import React from 'react'
import styled from 'styled-components'

interface ModalActionProps {
  stack?: boolean,
}

const ModalActions: React.FC<ModalActionProps> = ({ children, stack = false }) => {
  const l = React.Children.toArray(children).length
  return (
    <StyledModalActions flexDirection={stack ? 'column' : 'row'}>
      {React.Children.map(children, (child, i) => (
        <>
          <StyledModalAction>
            {child}
          </StyledModalAction>
          
        </>
      ))}
    </StyledModalActions>
  )
}

interface StyledModalActionProps {
  flexDirection: string,
}

const StyledModalActions = styled.div<StyledModalActionProps>`
  align-items: center;
  background-color: ${props => props.theme.color.grey[100]}00;
  display: flex;
  flex-direction: ${props => props.flexDirection};
  margin: ${props => props.theme.spacing[4]}px ${props => -props.theme.spacing[4]}px 0;
  padding: 0 ${props => props.theme.spacing[4]}px;

  @media (max-width: 767px){
    flex-direction: column;
    padding-bottom: ${props => props.theme.spacing[4]}px;
  }
`

const StyledModalAction = styled.div`
  flex: 1;
  margin: 5px;
  width: 100%;
`

const StyledSpacer = styled.div`
  width: ${props => props.theme.spacing[4]}px;
`

export default ModalActions