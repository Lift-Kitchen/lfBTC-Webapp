import React from 'react'
import styled from 'styled-components'

interface PageHeaderProps {
  subtitle?: string,
  title?: string,
}

const PageHeader: React.FC<PageHeaderProps> = ({ subtitle, title }) => {
  return (
    <StyledPageHeader>
      <StyledTitle>{title}</StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
    </StyledPageHeader>
  )
}

const StyledPageHeader = styled.div`
  align-items: flex-start;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: ${props => props.theme.spacing[6]}px;
  padding-left: 40px;
  padding-right: 400px;
  padding-top: ${props => props.theme.spacing[6]}px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  @media (max-width: 1024px) {
    padding-right: 40px;
  }
`

const StyledTitle = styled.h1`
  color: ${props => props.theme.color.white[100]};
  font-size: 48px;
  font-weight: 700;
  margin: 0;

  &:after {
    background-color: ${props => props.theme.color.orange[100]};
    content: '';
    display: block;
    height: 5px;
    margin: 20px 0;
    width: 100px;
  }
`

const StyledSubtitle = styled.h3`
  color: ${props => props.theme.color.white[100]};
  font-size: 24px;
  font-weight: 400;
  margin:0;
  padding: 0;
`
export default PageHeader