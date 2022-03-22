import { useEffect, useState } from 'react';
import useLiftKitchen from './useLiftKitchen';
import config from '../config';
import { TreasuryAllocationTime } from '../lift/types';

const useTreasuryAllocationTimes = () => {
  const [time, setTime] = useState<TreasuryAllocationTime>({
    prevAllocation: new Date(),
    nextAllocation: new Date(),
  });
  const liftKitchen = useLiftKitchen();

  useEffect(() => {
    if (liftKitchen) {
      liftKitchen.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [liftKitchen]);
  return time;
};

export default useTreasuryAllocationTimes;
