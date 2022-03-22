import { useCallback, useEffect, useState } from 'react';
import { stakingShareSummary } from '../lift/types';
import useLiftKitchen from './useLiftKitchen';
import config from '../config';

const useStakedBalanceOnBoardroom = ():stakingShareSummary => {
  const [summary, setSummary] = useState(null);
  const liftKitchen = useLiftKitchen();

  const fetchBalance = useCallback(async () => {
    const stakingShareSummary = await liftKitchen.getStakedAmountsShare()
    setSummary(stakingShareSummary);
  }, [liftKitchen?.isUnlocked]);

  useEffect(() => {
    if (liftKitchen?.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [liftKitchen?.isUnlocked, setSummary, liftKitchen]);

  return summary;
};

export default useStakedBalanceOnBoardroom;
