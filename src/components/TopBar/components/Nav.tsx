import React, { useState }  from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const Nav: React.FC = () => {
  const [navToggle, setNavToggle] = useState(false);

  const toggleNav = () => {
    setNavToggle(!navToggle);
  }

  return (
    <div className={navToggle ? 'mobileToggle showNav' : 'mobileToggle'}>
      <StyledNav>
        <StyledLink exact activeClassName="active" to="//lift.kitchen/about/" target="_blank">About</StyledLink>
        <StyledLink exact activeClassName="active" to="//lift.kitchen/investments/" target="_blank">Investments</StyledLink>
        <StyledLink exact activeClassName="active" to="//lift-kitchen.medium.com/" target="_blank">Medium</StyledLink>
        <StyledLink exact activeClassName="active" to="//discord.gg/gbqnjFSqrX" target="_blank">Discord</StyledLink>
        <StyledLink exact activeClassName="active" to="//twitter.com/liftdao" target="_blank">Twitter</StyledLink>
        <StyledLink exact activeClassName="active" to="//t.me/liftkitchendao" target="_blank">Telegram</StyledLink>
      </StyledNav>
      <StyledMobileLink onClick={toggleNav}>
        <></>
      </StyledMobileLink>
    </div>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  @media (max-width: 767px){
    display: none;
  }

  .showNav & {
    background-color: ${props => props.theme.color.grey[800]};
    display: flex;
    flex-direction: column;
    position: absolute;
      left: 0;
      top: 100%;
    width: 100%;
  }
`

const StyledLink = styled(NavLink)`
  color: ${props => props.theme.color.white[200]};
  font-size: 18px;
  font-weight: 400;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.white[100]};
  }
  &.active {
    color: ${props => props.theme.color.primary.main};
  }

  @media (max-width: 767px){
    border-bottom: 1px solid ${props => props.theme.color.grey[700]};
    display: block;
    padding: 10px 0;
    text-align: center;
    width: 100%;
  }
`

const StyledMobileLink = styled.button`
  background-color: ${props => props.theme.color.white[200]};
  border: none;
  display: block;
  height: 2px;
  position: relative;
  width: 16px;

  @media (min-width: 768px){
    display: none;
  }

  &:before,
  &:after {
    background-color: ${props => props.theme.color.white[200]};
    content: '';
    position: absolute;
    height: 2px;
    left: 0;
    width: 16px;
  }

  &:before {
    top: -6px;
  }

  &:after {
    bottom: -6px;
  }
`

export default Nav