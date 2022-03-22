import React, { useCallback, useMemo, useState } from 'react'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import useLiftKitchen from '../../../hooks/useLiftKitchen';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';

interface ApproveModalProps extends ModalProps {
  tokenName?: string,
  onConfirm: () => void,
}

const ApproveModal: React.FC<ApproveModalProps> = ({ onDismiss, onConfirm, tokenName = '' }) => {
  const liftKitchen = useLiftKitchen();

  const [approveStatus, approve] = useApprove(
    liftKitchen.externalTokens['wBTC'],
    liftKitchen.genesisVault().address,
  );


  return (
    <Modal variant={'modal'}>
      <ModalTitle text={`Approve ${tokenName}`} />
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button
          disabled={approveStatus !== ApprovalState.NOT_APPROVED}
          onClick={onConfirm}
          text="Approve wBTC Staking"
          variant="ghost"
        />
      </ModalActions>
    </Modal>
  )
}


export default ApproveModal