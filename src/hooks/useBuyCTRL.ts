import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import ERC20 from '../lift/ERC20';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useBuyCTRL = () => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

//console.log(liftKitchen);
  const handleSellLIFT = useCallback(
    (amount: string, token: ERC20) => {
      const amountBn = parseUnits(amount, token.decimal);
      handleTransactionReceipt(
         liftKitchen.buyCTRL(token.address, amountBn),
        `Stake ${amount} ${token.symbol} to ${liftKitchen.ideaFund().address}`,
      );
    },
    [liftKitchen],
  );
  return { onBuy: handleSellLIFT };
};

export default useBuyCTRL;
