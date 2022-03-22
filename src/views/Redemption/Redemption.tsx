import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { IdeaFundStats, WalletStats } from '../../lift/types';
import { Route, Switch, useRouteMatch, useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import SecondaryNav from '../../components/SecondaryNav';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import WalletCard from './components/WalletCard';
import WalletCardSingle from './components/WalletCardSingle';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useIdeaFundStats from '../../hooks/useIdeaFundStats';
import useLiftKitchen from '../../hooks/useLiftKitchen';

import usewBTCPrice from '../../hooks/usewBTCPrice';
import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';

import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { isUndefined } from 'util';

import hero from '../../assets/img/hero-cropped-alt.jpg';

const Redemption: React.FC = () => {
  const { path } = useRouteMatch();
  const liftKitchen = useLiftKitchen();
  const addTransaction = useTransactionAdder();

  const { addressId } = useParams();
		
	const [ideafund, setStat] = useState < WalletStats > ();

  //console.log(addressId);

	const fetchStats = useCallback(async () => {
    if (addressId == undefined) {
      setStat(await liftKitchen.getRedemptionStats());
    } else {
		  setStat(await liftKitchen.getRedemptionStatsSingle(addressId));
    }
	}, [liftKitchen]);


	useEffect(() => {
		if (liftKitchen) {
			fetchStats().catch((err) => console.error(err.stack));
		}
	}, [liftKitchen]);

  //if (!(typeof ideafund === "undefined"))
    //console.log(ideafund.chrisWallet.wbtcSupply);

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
        <PageHeaderWrapper>
          <PageHeader
            title="Calculate value at block 12774321"
            subtitle="Breakdown of what funds are available"
          />
      </PageHeaderWrapper>
      <SecondaryNav />
      {!(typeof ideafund === "undefined") ? ( 
         <StyledWallet>
            <StyledCardWrapper>

            {ideafund.map((info, i) => (
              <React.Fragment key={info.walletAddress}>
                <WalletCardSingle walletInfo={info} />
                {i < ideafund.length - 1}
              </React.Fragment>
            ))}
            </StyledCardWrapper>
          </StyledWallet>
        ) : (
          <>
          <div>Data is Loading</div>
          </>
        )}
      </Route>
      <Route path={`${path}/:addressId`}>
      <PageHeaderWrapper>
          <PageHeader
            title="Calculate value at block 12774321"
            subtitle="Breakdown of what your wallet held"
          />
      </PageHeaderWrapper>
      <SecondaryNav />
      {!(typeof ideafund === "undefined") ? ( 
         <StyledWallet>
            <StyledCardWrapper>

            {ideafund.map((info, i) => (
              <React.Fragment key={info.walletAddress}>
                <WalletCardSingle walletInfo={info} />
                {i < ideafund.length - 1}
              </React.Fragment>
            ))}
            </StyledCardWrapper>
          </StyledWallet>
        ) : (
          <>
          <div>Data is Loading</div>
          </>
        )}
        </Route>
      </Page>
    </Switch>
  );
};

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

export default Redemption;
