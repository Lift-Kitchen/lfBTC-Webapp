import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Bank } from '../lift';

const useHarvest = (bank: Bank) => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(
      liftKitchen.harvest(bank.contract),
      `Transfer ${bank.earnTokenName} from ${bank.contract} to Boardroom`,
    );
  }, [bank, liftKitchen]);

  return { onReward: handleReward };
};

export default useHarvest;
