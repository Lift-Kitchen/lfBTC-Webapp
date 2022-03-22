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
import useBuyCTRL from '../../../hooks/useBuyCTRL';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../lift';

interface StakeProps {
  bank: Bank;
}


const Buy: React.FC<StakeProps> = ({ bank }) => {
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);

  // TODO: reactive update of token balance
  const tokenBalance = useTokenBalance(bank.depositToken);
  //const stakedBalance = useStakedBalance(bank.contract);

  //console.log(tokenBalance);
  const { onBuy } = useBuyCTRL();
  const { onWithdraw } = useWithdraw(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        onBuy(amount, bank.depositToken);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol={bank.depositToken.symbol} title="" size={54} />
            </CardIcon>
            <Value value={getDisplayBalance(tokenBalance, bank.depositToken.decimal, 10)} />
            <Label text={`${bank.depositTokenName} Available for exchange`} />
          </StyledCardHeader>
          <StyledCardActions>
                <StyledActionSpacer />
                <IconButton
                  onClick={() => (approveStatus === ApprovalState.APPROVED ? onPresentDeposit() : approve())}
                >
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

export default Buy;
