import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import { Bank } from '../lift';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
     handleTransactionReceipt(liftKitchen.exit(bank.contract), `Redeem ${bank.contract}`);
  }, [bank, liftKitchen]);

  return { onRedeem: handleRedeem };
};

export default useRedeem;
