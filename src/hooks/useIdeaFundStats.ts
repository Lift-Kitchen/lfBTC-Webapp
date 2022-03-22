import { useCallback, useEffect, useState } from 'react';
import useLiftKitchen from './useLiftKitchen';
import { TokenStat } from '../lift/types';
import config from '../config';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const liftKitchen = useLiftKitchen();

  const fetchBondPrice = useCallback(async () => {
    setStat(await liftKitchen.getControlStat());
  }, [liftKitchen]);

  useEffect(() => {
    fetchBondPrice().catch((err) => console.error(`Failed to fetch CTRL price: ${err.stack}`));
    const refreshInterval = setInterval(fetchBondPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setStat, liftKitchen]);

  return stat;
};

export default useBondStats;
