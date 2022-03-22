import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { IdeaFundStats } from '../../lift/types';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useIdeaFundStats from '../../hooks/useIdeaFundStats';
import useLiftKitchen from '../../hooks/useLiftKitchen';
import useZapApprove from '../../hooks/useZapApprove';

import usewBTCPrice from '../../hooks/usewBTCPrice';
import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';

import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { isUndefined } from 'util';
import { web3ProviderFrom } from '../../lift/ether-utils';

const Zaps: React.FC = () => {
  const { path } = useRouteMatch();
  const liftKitchen = useLiftKitchen();
  const addTransaction = useTransactionAdder();
		
   // const [approveStatus, approve] = useZapApprove();

    const onApprove = useCallback(async () => {
        const Web3 = require('web3');
        const ethUtil = require('ethereumjs-util');
        var Tx = require('ethereumjs-tx');

        let web3 = new Web3(Web3.givenProvider);

        const gasPrice = await fetch('https://api.zapper.fi/v1/gas-price?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241')
        const gasPriceS = (Number(JSON.parse(JSON.stringify(await gasPrice.json())).standard)*10**9)/2;
        const wbtcToken = '0x0000000000000000000000000000000000000000';
        const response = await fetch(`https://api.zapper.fi/v1/zap-in/sushiswap/approval-transaction?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241&gasPrice=${gasPriceS}&sellTokenAddress=${wbtcToken}&ownerAddress=0x21A39B91637cFED5B79b5270499D8667b7646571`);
        

        const myJson = await response.json();

        web3.eth.sendTransaction(myJson).on('receipt' ,console.log);
    }, [liftKitchen]);

    const onExchange = useCallback(async () => {
      const Web3 = require('web3');
      const ethUtil = require('ethereumjs-util');
      var Tx = require('ethereumjs-tx');

      let web3 = new Web3(Web3.givenProvider);

      const gasPrice = await fetch('https://api.zapper.fi/v1/gas-price?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241')
      const gasPriceS = (Number(JSON.parse(JSON.stringify(await gasPrice.json())).standard)*10**9)/2;
      const apiKey = '96e0cc51-a62e-42ca-acee-910ea7d2a241';
      //ether = 0x0000000000000000000000000000000000000000
      //wbtc = 0x2260fac5e5542a773aa44fbcfedf7c193bc2c599
      const sellToken = '0x0000000000000000000000000000000000000000';
      const ownerAddress = '0x21A39B91637cFED5B79b5270499D8667b7646571';
      const slippage = '.01';
      const sellAmount = '1000000000000000000';
      const poolAddress = '0x0e250c3ff736491712c5b11ecee6d8dbfa41c78f';

      //const responseApproval = await fetch(`https://api.zapper.fi/v1/zap-in/sushiswap/approval-transaction?api_key=${apiKey}&gasPrice=${gasPriceS}&sellTokenAddress=${sellToken}&ownerAddress=${ownerAddress}`);
      
      const responseZapIn = await fetch(`https://api.zapper.fi/v1/zap-in/sushiswap/transaction?api_key=${apiKey}&gasPrice=${gasPriceS}&slippagePercentage=${slippage}&poolAddress=${poolAddress}&sellAmount=${sellAmount}&sellTokenAddress=${sellToken}&ownerAddress=${ownerAddress}`);

      const myJson = await responseZapIn.json();

      web3.eth.sendTransaction(myJson).on('receipt' ,console.log);
  }, [liftKitchen]);

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <PageHeader
            title="Testing Zapper Zaps"
            subtitle="Can we send a zap"
          />
          <Button onClick={onApprove} text="Approve the Zap!" variant="secondary" />
          <Button onClick={onExchange} text="Zap into Pool!" variant="secondary" />
          
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

export default Zaps;
