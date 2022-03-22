import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import SecondaryNav from '../../components/SecondaryNav';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import StakeControl from './components/StakeControl';
import { Switch } from 'react-router-dom';
import Page from '../../components/Page';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';

import Stat from './components/Stat';
import ProgressCountdown from './components/ProgressCountdown';
import usePegStats from '../../hooks/usePegStats';
import useTreasuryAmount from '../../hooks/useTreasuryAmount';
import Humanize from 'humanize-plus';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useBoardroomStats from '../../hooks/useBoardroomStats';
import Notice from '../../components/Notice';
import moment from 'moment';
import { getDisplayBalanceNum } from '../../utils/formatBalance'
import { BigNumber } from 'ethers';

import hero from '../../assets/img/board-hero-cropped-alt.jpg';

const Boardroom: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const { account } = useWallet();
  const stakingShareSummary = useStakedBalanceOnBoardroom();
  const pegStat = usePegStats();
  const valueCalc = useBoardroomStats();

  

  const scalingFactor = useMemo(
    () => (pegStat ? Number(pegStat.priceInWBTC).toFixed(3) : null),
    [pegStat],
  );
  const { prevAllocation, nextAllocation } = useTreasuryAllocationTimes();

  const prevEpoch = useMemo(
    () =>
      nextAllocation.getTime() <= Date.now()
        ? moment(nextAllocation).add(Math.floor((Date.now() - nextAllocation.getTime()) / 1000 / 60 / 60 / 24), 'days').toDate()
        : prevAllocation,
    [prevAllocation, nextAllocation],
  );
  const nextEpoch = useMemo(() => moment(prevEpoch).add(1, 'days').toDate(), [prevEpoch]);
  
  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
          <PageHeaderWrapper>
          <PageHeader
        subtitle="Please use the links above to join our Discord discussion and provide your opinion.  Use the liquiidty pools to buy/sell/stake at your own risk while this vote is going on."
        title="ALERT: We are having a vote to determine the future of the protocol!"
      />
          </PageHeaderWrapper>
          <SecondaryNav />
              <StyledText>
                Warning!  If you purchase LIFT tokens and stake them directly to the boardroom to earn CTRL rewards those tokens have the same 90 day tax applied.
              </StyledText>
            <StyledHeader>
              <ProgressCountdown
                base={prevEpoch}
                deadline={nextEpoch}
                description="Next Epoch"
              />
              <Stat
                title={pegStat ? `${pegStat.priceInWBTC}` : '-'}
                description="Next lfBTC/wBTC (TWAP)"
              />
              <Stat
                title={parseFloat(scalingFactor) > 1.05 ? `x${scalingFactor}` : '-'}
                description="Scaling Factor"
              />
            </StyledHeader>
            <StyledText>
                This takes a minute to load, it will happen!  
              </StyledText>
            <StyledHeader>
              <Stat title={`$${valueCalc?.totalValueBoardroom}`}
                    description="Total Boardroom Value"
              />                
              <Stat title={`$${valueCalc?.personalValueBoardroom}`}
                    description="Your Staked Boardroom Value"
              />                          
              <Stat title={`${valueCalc?.finalExpansion}`}
                    description="Expected # of CTRL at Expansion"
              />
              <Stat title={`$${valueCalc?.finalValue}`}
                    description="Approximate CTRL Value at Expansion"
              />
            </StyledHeader>
            <StyledBoardroom>
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <Harvest />
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Stake />
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <StakeControl />
                </StyledCardWrapper>
              </StyledCardsWrapper>
              <Spacer size="lg" />
            </StyledBoardroom>
          </>
        ) : (
          <>
            <PageHeaderWrapper>
              <PageHeader
                title="Join the Boardroom"
                subtitle="Deposit LIFT and CTRL and earn CTRL during expansion"
              />
            </PageHeaderWrapper>
            <UnlockWallet />
          </>
        )}
      </Page>
    </Switch>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledHeader = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 960px;

  > * {
    flex: 1;
    height: 84px;
    margin: 0 ${(props) => props.theme.spacing[2]}px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const StyledNoticeWrapper = styled.div`
  width: 768px;
  margin-top: -20px;
  margin-bottom: 40px;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 960px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledText = styled.div`
  margin-bottom: 40px;
  flex-basis: 100%;
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

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

export default Boardroom;
