import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLiftKitchen from './useLiftKitchen';
import config from '../config';

const useGenesisBalance = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const liftKitchen = useLiftKitchen();

  const fetchBalance = useCallback(async () => {
    setBalance(await liftKitchen.genesisVault().balanceOf(liftKitchen.myAccount));
  }, [liftKitchen?.isUnlocked]);

  useEffect(() => {
    if (liftKitchen?.isUnlocked) {
      fetchBalance().catch((err) =>
        console.error(`Failed to fetch Genesis balance: ${err.stack}`),
      );
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [liftKitchen?.isUnlocked]);

  return balance;
};

export default useGenesisBalance;
