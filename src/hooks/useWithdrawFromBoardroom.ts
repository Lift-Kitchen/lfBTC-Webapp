import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import { Bank } from '../lift';
import { useTransactionAdder } from '../state/transactions/hooks';
import { BigNumber } from 'ethers';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromBoardroom = () => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (value?: BigNumber | undefined) => {
      if(typeof value === "undefined")
      {
      handleTransactionReceipt(
        liftKitchen.withdrawAllShareFromBoardroom(),
        `Withdraw LIFT from the boardroom regardless of staked time`,
      );
      }
      else {
        handleTransactionReceipt(
          liftKitchen.withdrawShareFromBoardroom(value),
          `Withdraw LIFT from the boardroom staked at ${value}`
        );
      }
    },
    [liftKitchen],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromBoardroom;
