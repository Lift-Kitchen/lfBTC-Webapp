import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink,Link } from 'react-router-dom'
import styled from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Bank from '../Bank';
import BankCards from './BankCards';
import LaunchCountdown from '../../components/LaunchCountdown';
import Spacer from '../../components/Spacer';
import SecondaryNav from '../../components/SecondaryNav';
import HomeCard from './components/HomeCard';
import { OverviewData } from './types';
import useLiftKitchen from '../../hooks/useLiftKitchen';
import { useWallet } from 'use-wallet';
import Button from '../../components/Button';
import chris from '../../assets/img/chris_spears.jpg';
import mike from '../../assets/img/mike-winburn.jpg';
import alex from '../../assets/img/alex-avendano.jpg';

import hero from '../../assets/img/hero-cropped-alt.jpg';

const Home: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const liftKitchen = useLiftKitchen();

  const [{ peg, pegETH, control, share }, setStats] = useState<OverviewData>({});
  const fetchStats = useCallback(async () => {
    const [peg, pegETH, share, control] = await Promise.all([
      liftKitchen.getPegStat(),
      liftKitchen.getPegEthStat(),
      liftKitchen.getShareStat(),
      liftKitchen.getControlStat(),
    ]);

    setStats({ peg, pegETH, control, share });
  }, [liftKitchen, setStats]);

  useEffect(() => {
    if (liftKitchen) {
      fetchStats().catch((err) => console.error(err.stack));
    }
  }, [liftKitchen]);

  const pegETHAddr = useMemo(() =>liftKitchen?.LFETH.address, [liftKitchen]);
  const pegAddr = useMemo(() => liftKitchen?.LFBTC.address, [liftKitchen]);
  const shareAddr = useMemo(() => liftKitchen?.LIFT.address, [liftKitchen]);
  const controlAddr = useMemo(() => liftKitchen?.CTRL.address, [liftKitchen]);

  return (
    <Page>
      <PageHeaderWrapper>
      <PageHeader
        subtitle="Please use the links above to join our Discord discussion and provide your opinion.  Use the liquiidty pools to buy/sell/stake at your own risk while this vote is going on."
        title="ALERT: We are having a vote to determine the future of the protocol!"
      />
      </PageHeaderWrapper>
      <SecondaryNav />

        <StyledText>
            <Route exact path={path}>
            {!!account ? (
            <BankCards />
            ) : '' }

          { !account ? (
            <Center>
              <Button onClick={() => connect('injected')} text="Unlock Wallet" />
            </Center>
          ) : '' }

        </Route>
        <Route path={`${path}/:bankId`}>
          <Bank />
        </Route>
        </StyledText>
        <CardWrapper>
          <HomeCard
            title="Lift.Kitchen BTC"
            symbol="LFBTC"
            color="#e9b64c"
            supplyLabel="Circulating Supply"
            address={pegAddr}
            priceInwBTC={peg?.priceInWBTC}
            totalSupply={peg?.totalSupply}
            priceText="wBTC / lfBTC"
          />
          <Spacer size="lg" />
          <HomeCard
            title="Lift.Kitchen ETH"
            symbol="LFETH"
            color="#e9b64c"
            supplyLabel="Circulating Supply"
            address={pegETHAddr}
            priceInwBTC={pegETH?.priceInWBTC}
            totalSupply={pegETH?.totalSupply}
            priceText="wETH / lfETH"
          />
          <Spacer size="lg" />
          <HomeCard
            title="LIFT Share"
            symbol="LIFT"
            color="#4cb3ff"
            address={shareAddr}
            priceInwBTC={'$' + share?.priceInWBTC}
            totalSupply={share?.totalSupply}
            priceText="USD price"
          />
          <Spacer size="lg" />
          <HomeCard
            title="Control Token"
            symbol="CTRL"
            color="#77e463"
            address={controlAddr}
            priceInwBTC={'$' + control?.priceInWBTC }
            totalSupply={ control?.totalSupply }
            priceText="USD Price"
          />
        </CardWrapper>,
        <Spacer size="md" />
      

      <TeamSection>
        <TeamHeader>Operating Executives</TeamHeader>
        <TeamMembers>
          <Member>
            <MemberImage>
              <img src={chris} />
            </MemberImage>
            <MemberName>Chris<span>Spears</span></MemberName>
            <MemberInfo>Focused on innovation, concept development, fundraising, technology and consumer strategy, and overall senior leadership.</MemberInfo>            
            <a href="//linkedin.com/in/arkechris" className="linkedIn" target="_blank">LinkedIn</a>
            <a href="//www.youtube.com/channel/UCAPemCGnDBmBdFdyFZmK6ag" className="youTube" target="_blank">YouTube</a>
          </Member>
          <Member>
            <MemberImage>
              <img src={mike} />
            </MemberImage>
            <MemberName>Mike<span>Winburn</span></MemberName>
            <MemberInfo>Focused on technology standards and implementations, tech team building, security, and all things tech.</MemberInfo>
            <a href="//www.linkedin.com/in/michael-winburn-2406321/" className="linkedIn" target="_blank">LinkedIn</a>
          </Member>
          <Member>
            <MemberImage>
              <img src={alex} />
            </MemberImage>
            <MemberName>Alex<span>Avendano</span></MemberName>
            <MemberInfo>Focused on team building, operational management, financial strategies, and growth strategies.</MemberInfo>
            <a href="//www.linkedin.com/in/alexavendano/" className="linkedIn" target="_blank">LinkedIn</a>
          </Member>
        </TeamMembers>
      </TeamSection>
    </Page>
  );
}; 

const LPTokenHelpText: React.FC = () => {
  let pairName: string;
  let token1Url: string;
  let pairName2: string;
  let token2Url: string;

  pairName = 'wBTC-lfBTC pair';
  token1Url = 'https://zapper.fi/invest?protocol=sushiswap&contractAddress=0xd975b774c50aa0aeacb7b546b86218c1d7362123&modal=invest';
  pairName2 = 'lfBTC-LIFT pair';
  token2Url = 'https://zapper.fi/invest?protocol=sushiswap&contractAddress=0x0e250c3ff736491712c5b11ecee6d8dbfa41c78f&modal=invest';

  return (
    <CenterColumn>
      <StyledText>Currently sitting at 500-800% APY <a href="https://vfat.tools/liftkitchen/">(inspect here)</a> We use Zapper.fi to make that easy for you to provide liquidity at the link below!</StyledText>
      <StyledLinkBreak href={token1Url} target="_blank">
        {` Provide liquidity ${pairName} `}
      </StyledLinkBreak>
      <StyledLinkBreak href={token2Url} target="_blank">
        {` Provide liquidity ${pairName2} `}
      </StyledLinkBreak>
    </CenterColumn>
  );
};

const StyledText = styled.div`
  margin-bottom: 40px;
  flex-basis: 100%;
`;


const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const CenterColumn = styled(Center)`
  flex-direction: column;
`

const PageHeaderWrapper = styled.div `
	background-image: url(${hero});
	background-position: 50% 50%;
	background-repeat: no-repeat;
	background-size: cover;
	padding: 60px 0 20px;
	width: 100%;
	@media (max-width: 1023px){
	background-image: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hero});
	}
	@media (max-width: 767px){
	background-position: 90% 50%;
}
`;

const StyledOverview = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;


const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;


const StyledLinkBreak = styled(StyledLink)`
  background-color: ${(props) => props.theme.color.orange[100]};
  border-radius: 12px;
  color: ${(props) => props.theme.color.white[100]};
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 0px;
  padding: 10px 20px;
  text-align: center;

  &:hover {
    background-color: ${(props) => props.theme.color.orange[200]};
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledNoticeContainer = styled.div`
  max-width: 768px;
  width: 90vw;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const TeamSection = styled.div `
  background-color: ${(props) => props.theme.color.orange[100]};
  box-sizing: border-box;
  padding: 60px 0;
  margin-top: 60px;
  width: 100%;
`;

const TeamHeader = styled.h2 `
  color: ${props => props.theme.color.white[100]};
  font-size: 36px;
  font-weight: 400;
  margin: 20px 0;
  text-align: center;
`;

const TeamMembers = styled.div `
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
  padding: 40px;
`

const Member = styled.div `
  background-color: ${(props) => props.theme.color.white[100]};
  border-bottom-left-radius: 12px;
  border-top-right-radius: 12px;
  border-top-left-radius: 70px;
  box-sizing: border-box;
  box-shadow: 0 6px 12px -6px rgba(0,0,0,0.2);
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 31.333%;
  margin: 0 1%;
  max-width: 320px;
  padding: 20px;

  @media(max-width:767px){
    flex-basis: 100%;
  }

  .linkedIn,
  .youTube {
    align-items: center;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDU2LjY5MyA1Ni42OTMiIGhlaWdodD0iNTYuNjkzcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1Ni42OTMgNTYuNjkzIiB3aWR0aD0iNTYuNjkzcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik0yOC4zNDcsNS4xNTVjLTEzLjYsMC0yNC42MjUsMTEuMDI1LTI0LjYyNSwyNC42MjVjMCwxMy42MDIsMTEuMDI1LDI0LjYyNSwyNC42MjUsMjQuNjI1ICAgYzEzLjU5OCwwLDI0LjYyMy0xMS4wMjMsMjQuNjIzLTI0LjYyNUM1Mi45NywxNi4xODEsNDEuOTQ0LDUuMTU1LDI4LjM0Nyw1LjE1NXogTTQyLjA2Miw0MS43NDFjMCwxLjA5Ni0wLjkxLDEuOTgyLTIuMDMxLDEuOTgyICAgSDE2LjYxM2MtMS4xMjMsMC0yLjAzMS0wLjg4Ny0yLjAzMS0xLjk4MlYxOC4wNTJjMC0xLjA5NCwwLjkwOC0xLjk4MiwyLjAzMS0xLjk4Mkg0MC4wM2MxLjEyMSwwLDIuMDMxLDAuODg5LDIuMDMxLDEuOTgyVjQxLjc0MXoiLz48cGF0aCBkPSJNMzMuMDk5LDI2LjQ0MWMtMi4yMDEsMC0zLjE4OCwxLjIwOS0zLjc0LDIuMDYxdjAuMDQxaC0wLjAyN2MwLjAxLTAuMDEyLDAuMDItMC4wMjcsMC4wMjctMC4wNDF2LTEuNzY4aC00LjE1ICAgYzAuMDU1LDEuMTcsMCwxMi40ODQsMCwxMi40ODRoNC4xNXYtNi45NzNjMC0wLjM3NSwwLjAyNy0wLjc0NCwwLjEzNy0xLjAxMmMwLjMwMS0wLjc0NCwwLjk4NC0xLjUyLDIuMTI5LTEuNTIgICBjMS41MDQsMCwyLjEwNCwxLjE0NiwyLjEwNCwyLjgyNHY2LjY4aDQuMTVWMzIuMDZDMzcuODc4LDI4LjIyNCwzNS44MjksMjYuNDQxLDMzLjA5OSwyNi40NDF6Ii8+PHBhdGggZD0iTTIwLjg2NCwyMC43MTJjLTEuNDE5LDAtMi4zNDksMC45MzQtMi4zNDksMi4xNTljMCwxLjE5NywwLjksMi4xNTgsMi4yOTQsMi4xNThoMC4wMjdjMS40NDcsMCwyLjM0OC0wLjk2MSwyLjM0OC0yLjE1OCAgIEMyMy4xNTcsMjEuNjQ2LDIyLjI4NCwyMC43MTIsMjAuODY0LDIwLjcxMnoiLz48cmVjdCBoZWlnaHQ9IjEyLjQ4NCIgd2lkdGg9IjQuMTUxIiB4PSIxOC43NjIiIHk9IjI2LjczNCIvPjwvZz48L3N2Zz4=);
    background-position: center left;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    margin-right: 10px;
    height: 30px;
    padding-left: 36px;
    color: ${props => props.theme.color.grey[700]};
    text-decoration: none;
  }

  .youTube {
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDU2LjY5MyA1Ni42OTMiIGhlaWdodD0iNTYuNjkzcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1Ni42OTMgNTYuNjkzIiB3aWR0aD0iNTYuNjkzcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwb2x5Z29uIHBvaW50cz0iMTcuODMzLDMxLjg1MyAxOS42MTYsMzEuODUzIDE5LjYxNiw0MC43MSAyMS4zMzksNDAuNzEgMjEuMzM5LDMxLjg1MyAyMy4xMiwzMS44NTMgMjMuMTIsMzAuMzQ1IDE3LjgzMywzMC4zNDUgICAgICIvPjxwYXRoIGQ9Ik0yOC40MTMsMjQuNDkzYzAuMjM0LDAsMC40Mi0wLjA2MiwwLjU1Ny0wLjE4OWMwLjEzNy0wLjEzMSwwLjIwNy0wLjMwOSwwLjIwNy0wLjUzM3YtNC41OWMwLTAuMTg0LTAuMDctMC4zMzQtMC4yMTEtMC40NDUgICBjLTAuMTQxLTAuMTE1LTAuMzI0LTAuMTcyLTAuNTUzLTAuMTcyYy0wLjIwOSwwLTAuMzc5LDAuMDU3LTAuNTEyLDAuMTcyYy0wLjEzMSwwLjExMS0wLjE5NSwwLjI2Mi0wLjE5NSwwLjQ0NXY0LjU5ICAgYzAsMC4yMywwLjA2MSwwLjQwOCwwLjE4NCwwLjUzM0MyOC4wMTEsMjQuNDMxLDI4LjE4NywyNC40OTMsMjguNDEzLDI0LjQ5M3oiLz48cGF0aCBkPSJNMzIuMjEyLDMyLjk3Yy0wLjIzOCwwLTAuNDczLDAuMDYxLTAuNzA1LDAuMTgyYy0wLjIyOSwwLjEyMS0wLjQ0OSwwLjMwMS0wLjY1NCwwLjUzM3YtMy4zNGgtMS41NDVWNDAuNzFoMS41NDV2LTAuNTg2ICAgYzAuMTk5LDAuMjM2LDAuNDE4LDAuNDA4LDAuNjUyLDAuNTJjMC4yMzIsMC4xMTEsMC41LDAuMTY2LDAuODAxLDAuMTY2YzAuNDUxLDAsMC44MDEtMC4xNDMsMS4wMzctMC40MzIgICBjMC4yNC0wLjI5MSwwLjM2MS0wLjcwNSwwLjM2MS0xLjI0NnYtNC4yNDRjMC0wLjYyNy0wLjEyNy0xLjEwNC0wLjM4NS0xLjQyOEMzMy4wNjUsMzMuMTM0LDMyLjY5NiwzMi45NywzMi4yMTIsMzIuOTd6ICAgIE0zMi4xMjgsMzguOTIxYzAsMC4yNDYtMC4wNDUsMC40Mi0wLjEzMywwLjUyN2MtMC4wODgsMC4xMDktMC4yMjUsMC4xNjItMC40MTIsMC4xNjJjLTAuMTI5LDAtMC4yNS0wLjAyOS0wLjM2OS0wLjA4MiAgIGMtMC4xMTctMC4wNTMtMC4yNC0wLjE0Ni0wLjM2MS0wLjI3di00Ljc2NGMwLjEwNC0wLjEwNywwLjIwOS0wLjE4NiwwLjMxNC0wLjIzNGMwLjEwNS0wLjA1MywwLjIxNS0wLjA3NiwwLjMyNC0wLjA3NiAgIGMwLjIwNSwwLDAuMzY1LDAuMDY2LDAuNDc3LDAuMTk3YzAuMTA3LDAuMTM1LDAuMTYsMC4zMywwLjE2LDAuNTlWMzguOTIxeiIvPjxwYXRoIGQ9Ik0yNi42MjgsMzguODc0Yy0wLjE0MywwLjE2NC0wLjMwMSwwLjI5OS0wLjQ3MywwLjQwOGMtMC4xNzIsMC4xMDctMC4zMTYsMC4xNi0wLjQyNiwwLjE2ICAgYy0wLjE0NSwwLTAuMjQ4LTAuMDM5LTAuMzE0LTAuMTIxYy0wLjA2Mi0wLjA4LTAuMDk2LTAuMjExLTAuMDk2LTAuMzkxdi01Ljg2N2gtMS41Mjd2Ni4zOTVjMCwwLjQ1NywwLjA5LDAuNzkzLDAuMjY4LDEuMDI1ICAgYzAuMTgyLDAuMjI3LDAuNDQ1LDAuMzQsMC43OTksMC4zNGMwLjI4NywwLDAuNTg0LTAuMDc4LDAuODg5LTAuMjQyYzAuMzA1LTAuMTY2LDAuNTk4LTAuNCwwLjg4MS0wLjcwOXYwLjgzOGgxLjUyOXYtNy42NDZoLTEuNTI5ICAgVjM4Ljg3NHoiLz48cGF0aCBkPSJNMjguMzQ3LDUuMTU1Yy0xMy42LDAtMjQuNjI1LDExLjAyNS0yNC42MjUsMjQuNjI1YzAsMTMuNjAyLDExLjAyNSwyNC42MjUsMjQuNjI1LDI0LjYyNSAgIGMxMy42LDAsMjQuNjI1LTExLjAyMywyNC42MjUtMjQuNjI1QzUyLjk3MiwxNi4xOCw0MS45NDYsNS4xNTUsMjguMzQ3LDUuMTU1eiBNMzIuMzI1LDE3LjMxN2gxLjcxOXY2LjQ1OSAgIGMwLDAuMjAxLDAuMDM5LDAuMzQ0LDAuMTExLDAuNDMyYzAuMDcsMC4wOSwwLjE4OCwwLjEzNywwLjM1LDAuMTM3YzAuMTI1LDAsMC4yODUtMC4wNjEsMC40OC0wLjE3OCAgIGMwLjE5MS0wLjEyMSwwLjM2OS0wLjI3MSwwLjUyOS0wLjQ1N3YtNi4zOTNoMS43MjN2OC40MjRoLTEuNzIzdi0wLjkzYy0wLjMxNCwwLjM0Mi0wLjY0NSwwLjYwNS0wLjk5LDAuNzgzICAgYy0wLjM0MiwwLjE3OC0wLjY3NCwwLjI3LTAuOTk4LDAuMjdjLTAuMzk4LDAtMC42OTctMC4xMjctMC45LTAuMzc5Yy0wLjE5OS0wLjI0OC0wLjMwMS0wLjYyMy0wLjMwMS0xLjEyOVYxNy4zMTd6IE0yNS45MzUsMTkuMjQzICAgYzAtMC42NSwwLjIzLTEuMTcsMC42OTMtMS41NjFjMC40NjUtMC4zODMsMS4wODgtMC41NzgsMS44NjktMC41NzhjMC43MTMsMCwxLjI5NSwwLjIwNSwxLjc1MiwwLjYxMSAgIGMwLjQ1MywwLjQwNiwwLjY4LDAuOTM0LDAuNjgsMS41Nzh2NC4zNWMwLDAuNzIzLTAuMjIzLDEuMjg3LTAuNjY2LDEuNjk1Yy0wLjQ0OSwwLjQwOC0xLjA2MiwwLjYxMy0xLjg0NCwwLjYxMyAgIGMtMC43NTIsMC0xLjM1NS0wLjIxMS0xLjgwNy0wLjYzMWMtMC40NTEtMC40MjYtMC42NzgtMC45OTYtMC42NzgtMS43MTFWMTkuMjQzeiBNMjEuMjQ3LDE0LjMyM2wxLjI1OCw0LjU2MmgwLjEyM2wxLjE5Ny00LjU2MiAgIGgxLjk2OWwtMi4yNTQsNi42ODJ2NC43MzdoLTEuOTM4di00LjUyNmwtMi4zMDctNi44OTNIMjEuMjQ3eiBNNDMuNzg2LDM4LjM1NmMwLDMuMDQ3LTIuNDcxLDUuNTItNS41MTgsNS41MkgxOS4wOTIgICBjLTMuMDQ5LDAtNS41Mi0yLjQ3My01LjUyLTUuNTJ2LTQuNDM4YzAtMy4wNDksMi40NzEtNS41Miw1LjUyLTUuNTJoMTkuMTc2YzMuMDQ3LDAsNS41MTgsMi40NzEsNS41MTgsNS41MlYzOC4zNTZ6Ii8+PHBhdGggZD0iTTM2LjgyNywzMi44NzRjLTAuNjg2LDAtMS4yNCwwLjIwNy0xLjY3NCwwLjYyN2MtMC40MzIsMC40MTYtMC42NSwwLjk1OS0wLjY1LDEuNjE3djMuNDM4ICAgYzAsMC43MzgsMC4xOTksMS4zMTYsMC41OTIsMS43MzRjMC4zOTMsMC40MiwwLjkzMiwwLjYzMSwxLjYxNywwLjYzMWMwLjc2MiwwLDEuMzM0LTAuMTk3LDEuNzE1LTAuNTkyICAgYzAuMzg3LTAuMzk4LDAuNTc2LTAuOTg4LDAuNTc2LTEuNzczdi0wLjM5M2gtMS41NzJ2MC4zNDhjMCwwLjQ1MS0wLjA1MywwLjc0Mi0wLjE1MiwwLjg3M3MtMC4yNzcsMC4xOTctMC41MzEsMC4xOTcgICBjLTAuMjQ0LDAtMC40MTYtMC4wNzYtMC41MTgtMC4yM2MtMC4xLTAuMTU4LTAuMTQ4LTAuNDM2LTAuMTQ4LTAuODR2LTEuNDM5aDIuOTIydi0xLjk1M2MwLTAuNzIzLTAuMTg2LTEuMjc3LTAuNTYyLTEuNjY2ICAgQzM4LjA2NSwzMy4wNjcsMzcuNTI2LDMyLjg3NCwzNi44MjcsMzIuODc0eiBNMzcuNDMxLDM1Ljg4MmgtMS4zNXYtMC43NzNjMC0wLjMyLDAuMDQ5LTAuNTUzLDAuMTU2LTAuNjg2ICAgYzAuMTA3LTAuMTQzLDAuMjgxLTAuMjExLDAuNTI1LTAuMjExYzAuMjMsMCwwLjQwNCwwLjA2OCwwLjUwOCwwLjIxMWMwLjEwNSwwLjEzMywwLjE2LDAuMzY1LDAuMTYsMC42ODZWMzUuODgyeiIvPjwvZz48L3N2Zz4=);
  }
`

const MemberImage = styled.div `
  border-radius: 50%;
  height: 100px;
  width: 100px;
  overflow: hidden;

  img {
    max-width: 100%;
  }
`

const MemberName = styled.h4 `
  align-self: flex-end;
  margin: 0;
  font-size: 36px;
  span {
    font-weight: 100;
  }
`

const MemberInfo = styled.p `
  flex: 0 0 100%;
  font-size: 1rem;
`

export default Home;