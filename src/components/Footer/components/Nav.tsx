import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href="https://github.com/Lift-Kitchen/lfBTC-Seigniorage" target="_blank">GitHub</StyledLink>
      <StyledLink href="https://twitter.com/LiftDAO" target="_blank">Twitter</StyledLink>
      <StyledLink href="https://t.me/liftkitchendao" target="_blank">Telegram</StyledLink>
      <StyledLink href="https://discord.gg/gbqnjFSqrX" target="_blank">Discord</StyledLink>
      <StyledLink href="https://lift-kitchen.medium.com/" target="_blank">Medium</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  @media (max-width: 767px){
    display: none;
  }
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.grey[400]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
`

export default Nav