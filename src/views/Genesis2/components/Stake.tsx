import React, {useState} from 'react';
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

import DepositModal from './DepositModal';
import useLiftKitchen from '../../../hooks/useLiftKitchen';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToGenesis from '../../../hooks/useStakeToGenesis';
import useGenesisBalance from '../../../hooks/useGenesisBalance';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';


const Stake: React.FC = () => {
  const liftKitchen = useLiftKitchen();
  const [approveStatus, approve] = useApprove(
    liftKitchen.externalTokens['wBTC'],
    liftKitchen.genesisVault().address,
  );

  

  const tokenBalance = useTokenBalance(liftKitchen.externalTokens["wBTC"]);

  const stakedBalance = useGenesisBalance();

  //console.log(stakedBalance.toString());
  
  const displayBalance = getDisplayBalance(stakedBalance);

  const [stakeBal, setStakeBal] = useState(stakedBalance);
  const[displayBal, setDisplayBal] = useState(displayBalance);

  const { onStake } = useStakeToGenesis();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value, term) => {
        onStake(value, term);
        setDisplayBal(getDisplayBalance(stakedBalance, 8));
        onDismissDeposit();
      }}
      tokenName={'wBTC'}
    />,
  );

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="wBTC" title=""/>
            </CardIcon>
            <Value value={displayBalance} />
            <Label text="wBTC Staked" />
          </StyledCardHeader>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED ? (
              <Button
                disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                onClick={approve}
                text="Approve wBTC Staking"
                variant="ghost"
              />
            ) : (
              <>
                <IconButton onClick={onPresentDeposit}>
                  <AddIcon />
                </IconButton>
              </>
            )}
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
