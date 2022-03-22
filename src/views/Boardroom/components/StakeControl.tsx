import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';

import { getDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useLiftKitchen from '../../../hooks/useLiftKitchen';
import useStakedControlBalanceOnBoardroom from '../../../hooks/useStakedControlBalanceOnBoardroom';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeControlToBoardroom from '../../../hooks/useStakeControlToBoardroom';
import useWithdrawControlFromBoardroom from '../../../hooks/useWithdrawControlFromBoardroom';

const StakeControl: React.FC = () => {
  const liftKitchen = useLiftKitchen();
  const [approveStatus, approve] = useApprove(
    liftKitchen.CTRL,
    liftKitchen.currentBoardroom().address,
  );

  const tokenBalance = useTokenBalance(liftKitchen.CTRL);;
  const stakedBalance = useStakedControlBalanceOnBoardroom();

  //console.log("multi balance", stakedBalance[0][0], sstakedBalance[0][1])

  const { onStake } = useStakeControlToBoardroom();
  const { onWithdraw } = useWithdrawControlFromBoardroom();
  //const { onRedeem } = useRedeemOnBoardroom('Redeem Lift for Boardroom Migration');

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'CTRL'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      time={undefined}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'CTRL'}
    />,
  );

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="CTRL" title="" />
            </CardIcon>
            <Value value={getDisplayBalance(stakedBalance, 18, 10)} />
            <Label text="CTRL Shares Staked" />
          </StyledCardHeader>
          <StyledCardActions>
                <IconButton onClick={onPresentWithdraw}>
                  <RemoveIcon />
                </IconButton>
                <StyledActionSpacer />
                <IconButton onClick={approveStatus !== ApprovalState.APPROVED ? approve : onPresentDeposit}>
                  <AddIcon />
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

export default StakeControl;
