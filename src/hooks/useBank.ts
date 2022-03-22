import { useContext } from 'react';
import { Context as BanksContext } from '../contexts/Banks';
import { Bank, ContractName } from '../lift';

const useBank = (contractName: ContractName): Bank => {
  const { banks } = useContext(BanksContext);
  let Bank = banks.find((bank) => bank.name === contractName);
  //console.log(Bank);
  if (Bank === void(0))
    Bank = banks.find((bank) => bank.contract === contractName);
  return Bank;
};

export default useBank;
