import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLiftKitchen from './useLiftKitchen';
import config from '../config';

const useStakedControlBalanceOnBoardroom = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const liftKitchen = useLiftKitchen();

  const fetchBalance = useCallback(async () => {
    setBalance(await liftKitchen.getStakedControlOnBoardroom());
  }, [liftKitchen?.isUnlocked]);

  useEffect(() => {
    if (liftKitchen?.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [liftKitchen?.isUnlocked, setBalance, liftKitchen]);

  return balance;
};

export default useStakedControlBalanceOnBoardroom;
