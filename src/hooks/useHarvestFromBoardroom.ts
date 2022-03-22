import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromBoardroom = () => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(liftKitchen.harvestCTRLFromBoardroom(), 'Claim CTRL from Boardroom');
  }, [liftKitchen]);

  return { onReward: handleReward };
  return;
};

export default useHarvestFromBoardroom;
