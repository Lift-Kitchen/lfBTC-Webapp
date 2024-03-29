import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20 from '../lift/ERC20';
import useLiftKitchen from './useLiftKitchen';
import config from '../config';

const useTokenBalance = (token: ERC20) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const liftKitchen = useLiftKitchen();

  const fetchBalance = useCallback(async () => {
    setBalance(await token.balanceOf(liftKitchen.myAccount));
  }, [liftKitchen?.isUnlocked, token]);

  useEffect(() => {
    if (liftKitchen?.isUnlocked) {
      fetchBalance().catch((err) =>
        console.error(`Failed to fetch token balance: ${err.stack}`),
      );
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [liftKitchen?.isUnlocked, token]);

  return balance;
};

export default useTokenBalance;
