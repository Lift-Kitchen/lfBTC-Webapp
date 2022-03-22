import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useLiftKitchen from '../../hooks/useLiftKitchen';
import lift, { Bank } from '../../lift';
import config, { bankDefinitions } from '../../config';
import { getDisplayBalance } from '../../utils/formatBalance';
import ERC20 from '../../lift/ERC20';


const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const liftKitchen = useLiftKitchen();

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!liftKitchen.isUnlocked) continue;

        // only show pools staked by user
        //console.log(bankInfo.contract);
        //console.log(bankInfo.name);
        if (!bankInfo.name.includes("IdeaFund")) {
          const balance = await liftKitchen.stakedBalanceOnBank(bankInfo.contract, liftKitchen.myAccount);
          const earned = await liftKitchen.earnedFromBank(bankInfo.contract, liftKitchen.myAccount);
          if (balance.lte(0) && earned.lte(0)) {
            continue;
          }
        } else {
          banks.push({
            ...bankInfo,
            address: config.deployments[bankInfo.contract].address,
            depositToken: liftKitchen.localTokens[bankInfo.depositTokenName],
            poolTVL: "0",
            earnToken: liftKitchen.CTRL,
            apy: 0,
          });
          continue;
        }
      }
      
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: liftKitchen.externalTokens[bankInfo.depositTokenName],
        poolTVL: new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(Number(await liftKitchen.getPoolValue(bankInfo.depositTokenName))),
        earnToken: liftKitchen.LIFT,
        apy: Number((Number((await liftKitchen.getSharePrice()).mul(bankInfo.perWeek).div(await liftKitchen.getPoolValue(bankInfo.depositTokenName)).mul(52))/(1e16)).toFixed(0)),
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [liftKitchen, liftKitchen?.isUnlocked, setBanks]);

  useEffect(() => {
    if (liftKitchen) {
      fetchPools()
        .catch(err => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [liftKitchen, liftKitchen?.isUnlocked, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
