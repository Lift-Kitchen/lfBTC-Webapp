import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import useLiftKitchen from './useLiftKitchen';
import { ContractName } from '../lift';
import config from '../config';

const useStakedBalance = (poolName: ContractName) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const liftKitchen = useLiftKitchen();

  const fetchBalance = useCallback(async () => {
    const balance = await liftKitchen.stakedBalanceOnBank(poolName, liftKitchen.myAccount);
    setBalance(balance);
  }, [liftKitchen?.isUnlocked, poolName]);

  useEffect(() => {
    if (liftKitchen?.isUnlocked) {
      fetchBalance().catch(err => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [liftKitchen?.isUnlocked, poolName, setBalance, liftKitchen]);

  return balance;
};

export default useStakedBalance;
