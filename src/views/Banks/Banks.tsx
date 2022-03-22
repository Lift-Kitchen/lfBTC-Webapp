import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import LaunchCountdown from '../../components/LaunchCountdown';
import Bank from '../Bank';
import BankCards from './BankCards';
import { useWallet } from 'use-wallet';
import Button from '../../components/Button';
import styled from 'styled-components';
import SecondaryNav from '../../components/SecondaryNav';

import hero from '../../assets/img/banks-hero-cropped.jpg';

const Banks: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();

  return (
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
      </Page>
    </Switch>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const PageHeaderWrapper = styled.div`
  background-image: url(${hero});
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 80px 0 60px;
  width: 100%;
  @media (max-width: 1023px){
    background-image: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hero});
  }
  @media (max-width: 767px){
    background-position: 90% 50%;
  }
`;

export default Banks;
