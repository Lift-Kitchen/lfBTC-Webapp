import React, { createContext, useEffect, useState } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useWallet } from 'use-wallet';
import Lift from '../../lift';
import config from '../../config';

export interface LiftContext {
  lift?: Lift;
}

export const Context = createContext<LiftContext>({ lift: null });

export const LiftKitchenProvider: React.FC = ({ children }) => {
  //const { account, connector, error } = useWeb3React()

  const wallet = useWallet();

  const [lift, setLiftKitchen] = useState<Lift>();

  useEffect(() => {
    if (!lift) {
      const liftKitchen = new Lift(config);
      
      if (wallet.account) {
        // wallet was unlocked at initialization
        liftKitchen.unlockWallet(wallet.ethereum, wallet.account);
      } else {
        const Web3 = require('web3');
        let web3 = new Web3(Web3.givenProvider)
        
        // Check if User is already connected by retrieving the accounts
        if(Web3.givenProvider != null) {
        web3.eth.getAccounts().then((results: any) => {
                if (results[0])
                  wallet.connect('injected');
              });
        }
      }
      setLiftKitchen(liftKitchen);
    } else if (wallet.account) {
      lift.unlockWallet(wallet.ethereum, wallet.account);
    }
  }, [wallet.account]);

  return <Context.Provider value={{ lift }}>{children}</Context.Provider>;
};
