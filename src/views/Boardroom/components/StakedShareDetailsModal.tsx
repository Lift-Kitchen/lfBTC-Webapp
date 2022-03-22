import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import StakedShareDetails from './StakedShareDetails'

import { BigNumber } from 'ethers';
import { stakingShareSummary } from '../../../lift/types';

interface StakedShareDetailsModalProps extends ModalProps {
  summary: stakingShareSummary,
  tokenName?: string,
}

const StakedShareDetailsModal: React.FC<StakedShareDetailsModalProps> = ({ summary, onDismiss, tokenName = '' }) => {
  return (
    <Modal>
      <ModalTitle text={`Staking for ${tokenName}`} />
      <StakedShareDetailsWrapper>
        <StakedShareDetails
          summary={summary}
          symbol={tokenName}
        />
      </StakedShareDetailsWrapper>
      <ModalActions>
        <Button text="Okay" onClick={onDismiss} variant="ghost" />
      </ModalActions>
    </Modal>
  )
}

const StakedShareDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export default StakedShareDetailsModal