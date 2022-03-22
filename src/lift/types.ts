import { BigNumber } from 'ethers';
import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  name: string;
  contract: ContractName;
  depositTokenName: ContractName;
  instructions: string;
  earnTokenName: ContractName;
  poolTVL: string;
  sort: number;
  apy: number;
  perWeek: number;
  finished: boolean;
}

export interface earnedValue {
  controlValue: number;
  shareValue: number;
}

export interface stakingShareSummary {
  totalStakingAmount: BigNumber,
  stakingShares: stakingShare[]
}

export interface BoardroomStats {
  totalSupplyControl: BigNumber,
  totalSupplyShare: BigNumber,
  totalSupplyPeg: BigNumber,
  totalValueBoardroom: Number,
  valueOfControl: BigNumber,
  valueOfShare: BigNumber,
  valueOfPeg: BigNumber,
  personalControl: BigNumber,
  personalShare: stakingShareSummary,
  expansionValue: BigNumber,
  devfundRate: BigNumber,
  ideafundRate: BigNumber,
  personalValueBoardroom: Number,
  finalExpansion: Number,
  finalValue: Number
}

export interface stakingShare {
  amount: BigNumber,
  timestamp: BigNumber
}

export interface GenesisStats{
  wbtcSupply: number;
  totalmultipliedwbtc: number;
  //currentMultiplier: string;
  totalStakedValue: string;
  stakingTokenPrice: string;
  shareTokenPrice: string;
  stakepegPool: string;
  pegsharePool: string;
}

export interface IdeaFundStats {
  teamWallet: WalletInfo;
  ideaFundPrivateWallet: WalletInfo;
  ideaFundWallet: WalletInfo;
}

export interface WalletStatsAttributes {
  walletAddress: string;
  lfbtcSupply: BigNumber;
  lfbtcSupplyGenesis: BigNumber;
  lfethSupply: BigNumber;
  liftSupply: BigNumber;
  liftSupplyGenesis: BigNumber;
  ctrlSupply: BigNumber;
  ctrlInWallet: BigNumber;
}

export interface WalletStats extends Array<WalletStatsAttributes> {}

export interface WalletInfo {
  walletAddress: string;
  walletName: string;
  wbtcSupply: BigNumber;
  lfbtcSupply: BigNumber;
  wethSupply: BigNumber;
  lfethSupply: BigNumber;
  liftSupply: BigNumber;
  ctrlSupply: BigNumber;
  haifSupply: BigNumber;
  pegPairSupply: BigNumber;
  pegEthPairSupply: BigNumber;
  sharePairSupply: BigNumber;
}

export interface Bank extends  BankInfo {
  address: string;
  depositToken: ERC20;
  earnToken: ERC20;
}

export type TokenStat = {
  priceInWBTC: string;
  totalSupply: string;
};

export type TreasuryAllocationTime = {
  prevAllocation: Date;
  nextAllocation: Date;
}
