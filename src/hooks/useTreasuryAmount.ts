import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLiftKitchen from './useLiftKitchen';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const liftKitchen = useLiftKitchen();


  useEffect(() => {
    if (liftKitchen) {
      const { Treasury } = liftKitchen.contracts;
      liftKitchen.LFBTC.balanceOf(Treasury.address).then(setAmount);
    }
  }, [liftKitchen]);
  return amount;
};

export default useTreasuryAmount;
