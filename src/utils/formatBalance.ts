import { BigNumber } from 'ethers';

export const getDisplayBalance = (balance: BigNumber, decimals = 18, fractionDigits = 3) => {
  const number = getBalance(balance, decimals - fractionDigits);
  return (Number(number, ) / 10 ** fractionDigits).toFixed(fractionDigits);
};

export const getDisplayBalanceNum = (balance: Number, decimals = 18, fractionDigits = 3) => {
  if (balance === undefined)
  { 
    balance = 0; 
  } 
  //console.log(balance.toString());
  const number = getBalance(BigNumber.from(balance), decimals - fractionDigits);
  return (Number(number, ) / 10 ** fractionDigits).toFixed(fractionDigits);
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return getDisplayBalance(balance, decimals);
};

export function getBalance(balance: BigNumber, decimals = 18) : string {
  return balance.div(BigNumber.from(10).pow(decimals)).toString();
}
