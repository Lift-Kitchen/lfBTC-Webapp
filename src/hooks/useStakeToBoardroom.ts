import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBoardroom = () => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        liftKitchen.stakeShareToBoardroom(amount),
        `Stake ${amount} LIFT to the boardroom`,
      );
    },
    [liftKitchen],
  );
  return { onStake: handleStake };
};

export default useStakeToBoardroom;
