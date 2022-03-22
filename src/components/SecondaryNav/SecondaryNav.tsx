import React, { useState }  from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const SecondaryNav: React.FC = () => {

  return (
    <StyledNav>
      <StyledLink to="/" exact>Home</StyledLink>
      <StyledLink activeClassName="active" to="/bank">Liquidity Pools</StyledLink>
      <StyledLink activeClassName="active" to="/boardroom">Boardroom</StyledLink>
      <StyledLink activeClassName="active" to="/ideafund">IdeaFund</StyledLink>
      <StyledLink activeClassName="acitve" to="/control">Buy CTRL</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  background-color: ${props => props.theme.color.grey[900]};
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
  @media (max-width: 767px){
    flex-direction: column;
  }
`

const StyledLink = styled(NavLink)`
  border-right: 1px solid ${props => props.theme.color.grey[800]};
  color: ${props => props.theme.color.white[100]};
  display: block;
  font-size: 18px;
  font-weight: 400;
  padding: 10px 20px;
  text-decoration: none;
  text-transform: uppercase;

  &:first-child {
    border-left: 1px solid ${props => props.theme.color.grey[800]};
  }
  
  &:hover {
    background-color: ${props => props.theme.color.grey[800]};
  }

  &.active {
    background-color: ${props => props.theme.color.grey[800]};
  }

  @media (max-width: 767px){
    border-right: none;
    border-bottom: 1px solid ${props => props.theme.color.grey[800]};
    width: 100%;
  }

  @media (max-width: 767px){
    border-bottom: 1px solid ${props => props.theme.color.grey[700]};
    display: block;
    padding: 10px 0;
    text-align: center;
    width: 100%;
  }
`

export default SecondaryNav