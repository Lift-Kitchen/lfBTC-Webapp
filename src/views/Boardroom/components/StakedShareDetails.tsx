import React from 'react'
import styled from 'styled-components'
import { AddIcon, RemoveIcon, DetailsIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';

import { getDisplayBalance } from '../../../utils/formatBalance'
import { stakingShareSummary, stakingShare } from '../../../lift/types';

import { BigNumber } from 'ethers';
import { IndentStyle } from 'typescript';
import useModal from '../../../hooks/useModal';
import WithdrawModal from './WithdrawModal';
import useWithdrawFromBoardroom from '../../../hooks/useWithdrawFromBoardroom';

interface IProps {
  stakingShare: stakingShare;
  key: string;
}

interface StakedShareDetailsProps {
  summary: stakingShareSummary,
  symbol: string
}

const StakingShare: React.FC<{ stakingShare: stakingShare }> = ({ stakingShare }) => {
  const { onWithdraw } = useWithdrawFromBoardroom();

  const getFormattedTimestamp = (timestamp: BigNumber) => {
    var stakedOn = new Date(0);
    stakedOn.setUTCSeconds(timestamp.toNumber());
    return stakedOn.toISOString().split('T')[0];
  };

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakingShare.amount || BigNumber.from(0)}
      time={stakingShare.timestamp || BigNumber.from(0)}
      onConfirm={(value) => {
        onWithdraw(BigNumber.from(value));
        onDismissWithdraw();
      }}
      tokenName={'Lift'}
    />,
  );

  return(
  <>
    <StyledStakingShareWrapper>
      <StyledMaxTextBold>{getDisplayBalance(stakingShare.amount)}</StyledMaxTextBold>
      <StyledMaxText>{(Number(getDisplayBalance(stakingShare.amount, 18, 3)) * (10 + Math.floor(((Date.now() / 1000) - Number(stakingShare.timestamp)) / 60 / 60 / 24)) / 100).toFixed(3) }</StyledMaxText>
      <StyledMaxText>{Math.floor(((Date.now() / 1000) - Number(stakingShare.timestamp)) / 60 / 60 / 24)}</StyledMaxText>
      <StyledMaxText>{90 - Math.floor(((Date.now() / 1000) - Number(stakingShare.timestamp)) / 60 / 60 / 24)}</StyledMaxText>
      <StyledMaxText>{getFormattedTimestamp(stakingShare.timestamp)}</StyledMaxText>
      <IconButton onClick={onPresentWithdraw}>
        <RemoveIcon />
      </IconButton>
    </StyledStakingShareWrapper>;
  </>
  )
};

const StakedShareDetails: React.FC<StakedShareDetailsProps> = ({
  summary,
  symbol
}) => {
  const renderStakingShares = () => {
    return summary.stakingShares.map((stakingShare, i) => {
      if (stakingShare.amount > BigNumber.from(0))
        return <StakingShare key={i} stakingShare={stakingShare} />;
    });
  };

  return (
    <div>
      <StyledStakingSummary>
        <StyledTitleText>{getDisplayBalance(summary?.totalStakingAmount || BigNumber.from(0))} {symbol} Staked</StyledTitleText>
      </StyledStakingSummary>      
      <StyledStakingShareHeader>
        <StyledStakingShareHeaderCol>Total<br/>Stake</StyledStakingShareHeaderCol>
        <StyledStakingShareHeaderCol>Avail for<br/>Withdraw</StyledStakingShareHeaderCol>
        <StyledStakingShareHeaderCol>Days<br/>Staked</StyledStakingShareHeaderCol>
        <StyledStakingShareHeaderCol>Days<br/>Remain</StyledStakingShareHeaderCol>
        <StyledStakingShareHeaderCol>Date <br/> Staked</StyledStakingShareHeaderCol>
        <StyledStakingShareHeaderCol>Withdraw</StyledStakingShareHeaderCol>
      </StyledStakingShareHeader>
      <StyledStakingSharesWrapper>
        {renderStakingShares()}
      </StyledStakingSharesWrapper>
    </div>
  )
}
const StyledStakingSummary = styled.div`
  border-bottom: 1px solid ${props => props.theme.color.white[100]};
  padding-bottom: 10px;
  margin-bottom: 10px;

`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledMaxText = styled.div`
  align-items: center;
  color: ${props => props.theme.color.grey[400]};
  display: flex;
  font-size: 16px;
  font-weight: 400;
  justify-content: flex-start;

  &:nth-child(1) {
    flex:0 0 15%;
  }

  &:nth-child(2),
  &:nth-child(3),
  &:nth-child(4) {
    display: flex;
    flex:0 0 15%;
    justify-content: center;
    text-align: center;
  }

  &:nth-child(5) {
    flex:0 0 30%;
  }

  &:nth-child(6) {
    flex:0 0 10%;
  }
`

const StyledMaxTextBold = styled(StyledMaxText)`
  font-size: 16px;
  font-weight: 700;
`

const StyledTitleText = styled.div`
  align-items: center;
  color: ${props => props.theme.color.grey[400]};
  display: flex;
  font-size: 24px;
  font-weight: 700;
`

const StyledStakingSharesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 320px;
  overflow: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: .75rem;
  }

  &::-webkit-scrollbar-track {
    background-color: ${props => props.theme.color.grey[100]};
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.color.grey[700]};
    border: 2px solid ${props => props.theme.color.grey[100]};
    border-radius: 6px;
  }
`;

const StyledStakingShareWrapper = styled.div`
  border: 1px solid ${props => props.theme.color.grey[600]};
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;  
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
`;

const StyledStakingShareDetail = styled.div`
  padding-right: 10px;

`

const StyledStakingShareHeader = styled.div`
  display: flex;
  padding: 10px;
`

const StyledStakingShareHeaderCol = styled.div`
  color: ${props => props.theme.color.white[100]};

  &:nth-child(1) {
    flex:0 0 15%;
  }

  &:nth-child(2),
  &:nth-child(3),
  &:nth-child(4) {
    display: flex;
    flex:0 0 15%;
    justify-content: center;
    text-align: center;
  }

  &:nth-child(5) {
    flex:0 0 28%;
  }

  &:nth-child(6) {
    flex:0 0 12%;
  }

`
export default StakedShareDetails