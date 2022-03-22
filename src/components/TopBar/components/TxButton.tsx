import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Button from '../../Button';
import { isTransactionRecent, useAllTransactions } from '../../../state/transactions/hooks';
import useModal from '../../../hooks/useModal';
import TxModal from './TxModal';

const MAX_TRANSACTION_HISTORY = 10;

interface TxButtonProps {}

const TxButton: React.FC<TxButtonProps> = () => {
  const { account } = useWallet();
  const allTransactions = useAllTransactions();

  const pendingTransactions = useMemo(
    () => Object.values(allTransactions).filter((tx) => !tx.receipt).length,
    [allTransactions],
  );

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent);
  }, [allTransactions]);

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .slice(0, MAX_TRANSACTION_HISTORY);

  const [onPresentTransactionModal, onDismissTransactionModal] = useModal(
    <TxModal onDismiss={() => onDismissTransactionModal()} />,
  );

  const isEmpty = (confirmed?.length + pending?.length) == 0;
  //console.log(isEmpty);
  return (
    <>
      {!isEmpty && (
        <StyledTxButton>
          <Button
            size="sm"
            text={
              pending.length > 0 ? `${pending.length} Pending` : `Transactions`
            }
            variant={pending.length > 0 ? 'secondary' : 'default'}
            onClick={() => onPresentTransactionModal()}
          />
        </StyledTxButton>
      )}
    </>
  );
};

const StyledTxButton = styled.div`
  margin-right: ${(props) => props.theme.spacing[4]}px;
`;

export default TxButton;
