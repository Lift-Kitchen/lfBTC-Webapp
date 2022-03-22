import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLiftKitchen from './useLiftKitchen';
import { ContractName } from '../lift';
import config from '../config';

const useEarnings = (poolName: ContractName) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const liftKitchen = useLiftKitchen();

  const fetchBalance = useCallback(async () => {
     const balance = await liftKitchen.earnedFromBank(poolName, liftKitchen.myAccount);
     setBalance(balance);
  }, [liftKitchen?.isUnlocked, poolName]);

  useEffect(() => {
    if (liftKitchen?.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [liftKitchen?.isUnlocked, poolName, liftKitchen]);

  return balance;
};

export default useEarnings;
