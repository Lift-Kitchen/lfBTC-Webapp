import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'

interface CardProps {
  children?: React.ReactNode,
  variant?: 'default' | 'modal'
}

const Card: React.FC<CardProps> = ({
  children, 
  variant 
}) => {

  const { color } = useContext(ThemeContext)

  let bgColor: string

  switch (variant) {
    case 'modal':
      bgColor = color.white[100];
      break
    case 'default':
    default:
      bgColor = color.grey[900];
  }

  return (
    <StyledCard
      backgroundColor={bgColor}
    >
      {children}
    </StyledCard>
  )
}

interface StyledCardProps {
  backgroundColor: string
}

const StyledCard = styled.div<StyledCardProps>`
  background-color: ${props => props.backgroundColor};
  border-radius: 12px;
  box-shadow: 0 6px 12px -6px rgba(0,0,0,0.2);
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 10px;
`

export default Card