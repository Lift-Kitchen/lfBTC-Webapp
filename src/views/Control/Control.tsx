import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { IdeaFundStats } from '../../lift/types';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import SecondaryNav from '../../components/SecondaryNav';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
//import WalletCard from './components/WalletCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useIdeaFundStats from '../../hooks/useIdeaFundStats';
import useLiftKitchen from '../../hooks/useLiftKitchen';

import usewBTCPrice from '../../hooks/usewBTCPrice';
import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';
// import Redeem from './components/Redeem';
import Buy from './components/Buy';

//import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { isUndefined } from 'util';
import { Bank } from '../../lift';
import useBank from '../../hooks/useBank';
import useBanks from '../../hooks/useBanks';

import hero from '../../assets/img/hero-cropped-alt.jpg';

const Control: React.FC = () => {
  const { path } = useRouteMatch();
  const liftKitchen = useLiftKitchen();
  const addTransaction = useTransactionAdder();

  const { account } = useWallet();

  const [banks] = useBanks();
  const bank = useBank("IdeaFundLFBTC");
  const bank1 = useBank("IdeaFundLIFT");


  //if (!(typeof ideafund === "undefined"))
    //console.log(ideafund.chrisWallet.wbtcSupply);

  return account && bank ? (
    <Switch>
      <Page>
        <Route exact path={path}>
        <PageHeaderWrapper>
        <PageHeader
        subtitle="Please use the links above to join our Discord discussion and provide your opinion.  Use the liquiidty pools to buy/sell/stake at your own risk while this vote is going on."
        title="ALERT: We are having a vote to determine the future of the protocol!"
      />
      </PageHeaderWrapper>
      <SecondaryNav />
        <StyledText>Please be patient with the approve button before hitting the + sign again.  Please let us know in Discord if you get an error!</StyledText>
        <StyledWallet>
          
         <StyledCardWrapper>
              <Buy bank={bank} />
            </StyledCardWrapper>
            <StyledCardWrapper>
              <Buy bank={bank1} />
            </StyledCardWrapper>
          </StyledWallet>

      </Route>
      </Page>
    </Switch>
    ) : (
      <>
      </>
    );
};

const StyledText = styled.div`
  margin-bottom: 40px;
  flex-basis: 100%;
`;

const StyledWallet = styled.div`
  display: flex;
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;


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

export default Control;
