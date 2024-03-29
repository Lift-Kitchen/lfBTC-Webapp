import React, { useCallback, useMemo, useState } from 'react'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'

import { getDisplayBalance } from '../../../utils/formatBalance'
import { BigNumber } from 'ethers';

interface WithdrawModalProps extends ModalProps {
  max: BigNumber,
  onConfirm: (amount: string) => void,
  tokenName?: string,
  decimals?: number,
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '', decimals = 18 }) => {
  const [val, setVal] = useState('')

  const fullBalance = useMemo(() => {
    return getDisplayBalance(max, decimals, 10)
  }, [max])

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <ModalTitle text={'@everyone Genesis Stakers:  If you want to restake your LP for an additional 30 days you will be rewarded with CTRL tokens for each additional 30 days will receive 10% per month in CTRL tokens.  Please contact chris | lift.kitchen #1618 in discord for details.'} />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button text="Confirm" onClick={() => onConfirm(val)} />
      </ModalActions>
    </Modal>
  )
}

export default WithdrawModal