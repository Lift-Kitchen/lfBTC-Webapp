import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import { Bank } from '../lift';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useStake = (bank: Bank) => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, bank.depositToken.decimal);
      handleTransactionReceipt(
        liftKitchen.stake(bank.contract, amountBn),
        `Stake ${amount} ${bank.depositTokenName} to ${bank.contract}`,
      );
    },
    [bank, liftKitchen],
  );
  return { onStake: handleStake };
};

export default useStake;
