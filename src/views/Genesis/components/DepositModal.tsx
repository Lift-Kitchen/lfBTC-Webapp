import React, { useCallback, useMemo, useState } from 'react'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'

import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { BigNumber } from 'ethers';

interface DepositModalProps extends ModalProps {
  max: BigNumber,
  onConfirm: (amount: string, term: number) => void,
  tokenName?: string,
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('0')

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, 8)
  }, [max])

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal variant={'modal'}>
      <ModalTitle text={`Deposit ${tokenName}`} />
      <ModalTitle text={'Please wait for approval to process before staking!'} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions stack={true}>
        <Button text="2x exchange to lfBTC/LIFT for 30 day lock" variant="ghost" onClick={() => onConfirm(val, 1)} />
        <Button text="3x exchange to lfBTC/LIFT for 60 day lock" variant="ghost" onClick={() => onConfirm(val, 2)} />
        <Button text="4x exchange to lfBTC/LIFT for 90 day lock" variant="ghost" onClick={() => onConfirm(val, 3)} />
        <Button text="5x exchange to lfBTC/LIFT for 120 day lock" variant="ghost" onClick={() => onConfirm(val, 4)} />
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
      </ModalActions>
    </Modal>
  )
}


export default DepositModal