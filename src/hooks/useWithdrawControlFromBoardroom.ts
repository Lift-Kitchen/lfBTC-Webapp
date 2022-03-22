import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import { useTransactionAdder } from '../state/transactions/hooks';
import { BigNumber } from 'ethers';
import { Bank } from '../lift';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';


const useWithdrawControlFromBoardroom = () => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      //const amount = parseUnits(amountS, 18);
      handleTransactionReceipt(
        liftKitchen.withdrawControlFromBoardroom(amount),
        `Withdraw ${amount} CTRL from the boardroom`,
      );
    },
    [liftKitchen],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawControlFromBoardroom;
