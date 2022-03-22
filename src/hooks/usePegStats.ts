import { useCallback, useEffect, useState } from 'react';
import useLiftKitchen from './useLiftKitchen';
import { TokenStat } from '../lift/types';
import config from '../config';

const usePegStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const liftKitchen = useLiftKitchen();

  
  const fetchPegPrice = useCallback(async () => {
    setStat(await liftKitchen.getPegStat());
  }, [liftKitchen]);

  useEffect(() => {
    fetchPegPrice().catch((err) => console.error(`Failed to fetch lfBTC price: ${err.stack}`));
    const refreshInterval = setInterval(fetchPegPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setStat, liftKitchen]);

  return stat;
};

export default usePegStats;
