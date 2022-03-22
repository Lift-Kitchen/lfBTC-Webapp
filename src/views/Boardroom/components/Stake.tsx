import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon, DetailsIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import StakedShareDetailsModal from './StakedShareDetailsModal';
import useLiftKitchen from '../../../hooks/useLiftKitchen';
import useStakedBalanceOnBoardroom from '../../../hooks/useStakedBalanceOnBoardroom';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToBoardroom from '../../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../../hooks/useWithdrawFromBoardroom';

import { BigNumber } from '@ethersproject/bignumber';

const Stake: React.FC = () => {
  const liftKitchen = useLiftKitchen();
  const [approveStatus, approve] = useApprove(
    liftKitchen.LIFT,
    liftKitchen.currentBoardroom().address,
  );

  const { color } = useContext(ThemeContext);
  const tokenBalance = useTokenBalance(liftKitchen.LIFT);;
  const stakingShareSummary = useStakedBalanceOnBoardroom();

  //console.log("multi balance", stakedBalance[0][0], sstakedBalance[0][1])

  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();
 
  //const { onRedeem } = useRedeemOnBoardroom('Redeem Lift for Boardroom Migration');

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'Lift'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakingShareSummary?.totalStakingAmount || BigNumber.from(0)}
      time={undefined}
      onConfirm={(value) => {
        onWithdraw(undefined);
        onDismissWithdraw();
      }}
      tokenName={'Lift'}
    />,
  );

  const [onPresentDetails, onDismissDetails] = useModal(
    <StakedShareDetailsModal
      summary={stakingShareSummary}
      tokenName={'Lift'}
    />,
  );

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="LIFT" title=""/>
            </CardIcon>
            <Value value={getDisplayBalance(stakingShareSummary?.totalStakingAmount || BigNumber.from(0))} />
            <Label text="LIFT Shares Staked" />
          </StyledCardHeader>
          <StyledCardActions>
                <IconButton onClick={onPresentDetails}>
                  <RemoveIcon />
                </IconButton>
                <StyledActionSpacer />
                <IconButton onClick={approveStatus === ApprovalState.APPROVED ? onPresentDeposit : approve}>
                  <AddIcon />
                </IconButton>
                <StyledActionSpacer />
                <IconButton onClick={onPresentWithdraw} textColor={color.grey[300]}>
                  <DetailsIcon />
                </IconButton>
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
