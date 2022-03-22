import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import Nav from './components/Nav'
import TxButton from './components/TxButton'

const TopBar: React.FC = () => {
  return (
    <StyledTopBar>
      <Container size="lg">
        <StyledTopBarInner>
          <div className="logo">
            <Logo />
          </div>
          <Nav />
          <div className="transactions">
            <TxButton />
          </div>
        </StyledTopBarInner>
      </Container>
    </StyledTopBar>
  )
}

const StyledTopBar = styled.div`
  background: rgba(26,25,35,0.5);
  border-bottom: 1px solid rgba(255,255,255,0.125);
  position: relative;
`

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${props => props.theme.topBarSize}px;
  justify-content: space-between;
  max-width: ${props => props.theme.siteWidth}px;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 767px){
    .transactions {
      order: 2;
    }

    .mobileToggle {
      order: 3;
    }
  }

`

export default TopBar