import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeControlToBoardroom = () => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        liftKitchen.stakeControlToBoardroom(amount),
        `Stake ${amount} CTRL to the boardroom`,
      );
    },
    [liftKitchen],
  );
  return { onStake: handleStake };
};

export default useStakeControlToBoardroom;
