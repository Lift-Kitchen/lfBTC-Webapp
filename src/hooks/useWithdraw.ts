import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import { Bank } from '../lift';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useWithdraw = (bank: Bank) => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, bank.depositToken.decimal);
      handleTransactionReceipt(
        liftKitchen.unstake(bank.contract, amountBn),
        `Withdraw ${amount} ${bank.depositTokenName} from ${bank.contract}`,
      );
    },
    [bank, liftKitchen],
  );
  return { onWithdraw: handleWithdraw };

};

export default useWithdraw;
