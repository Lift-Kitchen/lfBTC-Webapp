import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import useTokenBalance from '../../hooks/useTokenBalance';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import styled from 'styled-components';
import ERC20 from '../../lift/ERC20';
import useLiftKitchen from '../../hooks/useLiftKitchen';
import { OverviewData } from './types';
import { useTransactionAdder } from '../../state/transactions/hooks';

const Data: React.FC = () => {
  const liftKitchen = useLiftKitchen();

  const { token } = useParams();
  
  var tokenSup = "0";

  const [{ peg, control, share }, setStats] = useState<OverviewData>({});
  const ercToken = useCallback(async () => {
    const [peg, share, control] = await Promise.all([
      liftKitchen.getPegStat(),
      liftKitchen.getShareStat(),
      liftKitchen.getControlStat(),
    ]);

    console.log(token);

    if (token === liftKitchen.LIFT.symbol)
      tokenSup = share.totalSupply;

    if (token === liftKitchen.LFBTC.symbol)
      tokenSup = peg.totalSupply;

    setStats({ peg, control, share });
  }, [liftKitchen, setStats]);

  return (
         <> {tokenSup} </>
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

export default Data;
