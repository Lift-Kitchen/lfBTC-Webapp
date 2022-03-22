import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../../utils/formatBalance';

import Button from '../../Button';
import Label from '../../Label';
import Modal, { ModalProps } from '../../Modal';
import ModalTitle from '../../ModalTitle';
import useLiftKitchen from '../../../hooks/useLiftKitchen';
import TokenSymbol from '../../TokenSymbol';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const liftKitchen = useLiftKitchen();

  const pegBalance = useTokenBalance(liftKitchen.LFBTC);;
  const displaypegBalance = useMemo(() => getDisplayBalance(pegBalance), [pegBalance]);

  const shareBalance = useTokenBalance(liftKitchen.LIFT);;
  const displayshareBalance = useMemo(() => getDisplayBalance(shareBalance), [shareBalance]);

  const controlBalance = useTokenBalance(liftKitchen.CTRL);;
  const displaycontrolBalance = useMemo(() => getDisplayBalance(controlBalance), [controlBalance]);

  return (
    <Modal>
      <ModalTitle text="My Wallet" />

      <Balances>
        <StyledBalanceWrapper>
          <TokenSymbol symbol="LFBTC" title=""/>
          <StyledBalance>
            <StyledValue>{displaypegBalance}</StyledValue>
            <Label text="LFBTC Available" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="LIFT" title="" />
          <StyledBalance>
            <StyledValue>{displayshareBalance}</StyledValue>
            <Label text="LIFT Available" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="CTRL" title="" />
          <StyledBalance>
            <StyledValue>{displaycontrolBalance}</StyledValue>
            <Label text="CTRL Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
      </Balances>
    </Modal>
  )
}

const StyledValue = styled.div`
  color: ${props => props.theme.color.grey[300]};
  font-size: 30px;
  font-weight: 700;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[4]}px;
`

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 ${props => props.theme.spacing[3]}px;
`

const StyledBalanceIcon = styled.div`
  font-size: 36px;
  margin-right: ${props => props.theme.spacing[3]}px;
`

const StyledBalanceActions = styled.div`
  align-items: center;
  display: flex;
  margin-top: ${props => props.theme.spacing[4]}px;
`

export default AccountModal