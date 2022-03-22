import { useCallback } from 'react';
import useLiftKitchen from './useLiftKitchen';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { getDisplayBalance } from '../utils/formatBalance';
import { ethers } from 'ethers'

const useStakeToGenesis = () => {
  const liftKitchen = useLiftKitchen();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string, term: number) => {
      //console.log(ethers.utils.parseEther(amount).div(1e10).toString());
      handleTransactionReceipt(
        liftKitchen.stakeShareToGenesis(ethers.utils.parseEther(amount).div(1e10), term),
        `Stake ${getDisplayBalance(ethers.utils.parseEther(amount).div(1e10), 8)} wBTC to the Genesis`,
      );
    },
    [liftKitchen],
  );
  return { onStake: handleStake };
};

export default useStakeToGenesis;
