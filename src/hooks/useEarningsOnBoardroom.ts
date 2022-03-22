import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLiftKitchen from './useLiftKitchen';
import config from '../config';
import { earnedValue } from '../lift/types';

const useEarningsOnBoardroom = () => {
  const [balance, setBalance] = useState<earnedValue>();
  const liftKitchen = useLiftKitchen();

  const fetchBalance = useCallback(async () => {
     setBalance(await liftKitchen.getEarningsOnBoardroom());
  }, [liftKitchen?.isUnlocked]);

  useEffect(() => {
    if (liftKitchen?.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [liftKitchen?.isUnlocked, setBalance]);

  return balance;
};

export default useEarningsOnBoardroom;
