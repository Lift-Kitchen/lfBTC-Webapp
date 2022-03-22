import { useCallback, useEffect, useState } from 'react';
import useLiftKitchen from './useLiftKitchen';
import { BoardroomStats } from '../lift/types';
import config from '../config';

const useBoardroomStats = () => {
  const [stat, setStat] = useState<BoardroomStats>();
  const liftKitchen = useLiftKitchen();

  
  const fetchBoardroomStats = useCallback(async () => {
    setStat(await liftKitchen.getBoardroomStats());
  }, [liftKitchen]);

  useEffect(() => {
    fetchBoardroomStats().catch((err) => console.error(`Failed to fetch Boardroom Status: ${err.stack}`));
    const refreshInterval = setInterval(fetchBoardroomStats, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setStat, liftKitchen]);

  return stat;
};

export default useBoardroomStats;
