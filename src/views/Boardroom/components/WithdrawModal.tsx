import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import Container from '../../../components/Container';
import Label from '../../../components/Label';

import { getDisplayBalance } from '../../../utils/formatBalance'
import { BigNumber } from 'ethers';

interface WithdrawModalProps extends ModalProps {
  max: BigNumber,
  time: BigNumber,
  onConfirm: (amount: string) => void,
  tokenName?: string,
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, time, tokenName = '' }) => {
  const [val, setVal] = useState('')

  const fullBalance = useMemo(() => {
    return getDisplayBalance(max, 18, 13)
  }, [max])

  const getFormattedTimestamp = (timestamp: BigNumber) => {
    var stakedOn = new Date(0);
    stakedOn.setUTCSeconds(timestamp.toNumber());
    return stakedOn.toLocaleString();
  };

  const DaysPrior = (timestamp: BigNumber) => {
    var stakedOn = getFormattedTimestamp(timestamp);
    var daysLeft = BigNumber.from(Date.now()).div(1000).sub(timestamp).div(60).div(60).div(24);
    return BigNumber.from(90).sub(daysLeft);
  }
  
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Container>
    {time != undefined ? (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <Center>
      <Label text={`Withdrawing ${fullBalance} staked on ${getFormattedTimestamp(time)}`} />
      <Label text={`You are withdrawing ${DaysPrior(time)} days before the end of your staking`} />
      <Label text={`and will lose approximately ${DaysPrior(time)}% of your lift`} />
      </Center>
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button text="Confirm" onClick={() => onConfirm(time.toString())} variant="ghost" />
      </ModalActions>
    </Modal>
    ) : (
      
      <Modal>
      <ModalTitle text={`Withdraw this ${tokenName}`} />
      {tokenName.toString() == "CTRL" ? (
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      ) : (
        <Center>
        <Label text={`Bypassing lock period warnings may result in large LIFT reductions`} />
        <Label text={`-------------------------------------------------------------------------`} />
        <Label text={`PLEASE CONFIRM YOU WANT TO CONTINUE!`} />
        </Center>
      )}
        <ModalActions>
          <Button text="Cancel" variant="secondary" onClick={onDismiss} />
          <Button text="Confirm" onClick={() => onConfirm(val)} />
        </ModalActions>
      </Modal>
    )}
    </Container>
  )



}

const Center = styled.div`
display: left;
flex: 1;
align-items: center;
justify-content: center;
`;

export default WithdrawModal