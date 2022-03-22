import { useCallback, useEffect, useState } from 'react';
import useLiftKitchen from './useLiftKitchen';
import config from '../config';
import { BigNumber } from 'ethers';

const usewBTCPrice = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const liftKitchen = useLiftKitchen();

  const fetchwBTCPrice = useCallback(async () => {
    setPrice(await liftKitchen.getwBTCPrice());
  }, [liftKitchen]);

  useEffect(() => {
    fetchwBTCPrice().catch((err) => console.error(`Failed to fetch wBTC price: ${err.stack}`));
    const refreshInterval = setInterval(fetchwBTCPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, liftKitchen]);

  return price;
};

export default usewBTCPrice;
