import { Fetcher, Route, Token } from '@sushiswap/sdk';
import { Configuration } from './config';
import { ContractName, GenesisStats, IdeaFundStats, WalletInfo, WalletStats, WalletStatsAttributes, BoardroomStats, TokenStat, TreasuryAllocationTime, earnedValue, stakingShare, stakingShareSummary } from './types';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import HarvestPairABI from './HarvestPair.abi.json';
import { formatUnits } from 'ethers/lib/utils';
import Web3 from 'web3';

/**
 * An API module of Lift Kitchen contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class Lift {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  localTokens: { [name: string]: ERC20 };

  wBTClfBTC: Contract;
  wBTClfBTCH: Contract;
  lfBTCLIFT: Contract;
  lfBTCLIFTH: Contract;
  wETHlfETH: Contract;
  IdeaFund: Contract;
  WBTC: ERC20;
  WETH: ERC20;
  LFBTC: ERC20;
  LFETH: ERC20;
  LIFT: ERC20;
  CTRL: ERC20;
  HAIF: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal); 
    }
    
    this.LFBTC = new ERC20(deployments.LFBTC.address, provider, 'LFBTC');
    this.LFETH = new ERC20(deployments.LFETH.address, provider, 'LFETH');
    this.LIFT = new ERC20(deployments.LIFT.address, provider, 'LIFT');
    this.CTRL = new ERC20(deployments.CTRL.address, provider, 'CTRL');
    this.HAIF = new ERC20(deployments.HAIF.address, provider, 'HAIF');

    this.localTokens = {};
    this.localTokens[this.LFBTC.symbol] = this.LFBTC;
    this.localTokens[this.LIFT.symbol] = this.LIFT;
    
    // Uniswap V2 Pair
    this.wBTClfBTC = new Contract(
      externalTokens['wBTC-lfBTC'][0],
      IUniswapV2PairABI,
      provider,
    );

    this.wBTClfBTCH = new Contract(
      externalTokens['wBTC-lfBTC-Harvest'][0],
      IUniswapV2PairABI,
      provider,
    );

    this.lfBTCLIFTH = new Contract(
      externalTokens['lfBTC-LIFT-Harvest'][0],
      IUniswapV2PairABI,
      provider,
    );

    this.lfBTCLIFT = new Contract(
        externalTokens['lfBTC-LIFT'][0],
        IUniswapV2PairABI,
        provider,
      );

    this.wETHlfETH = new Contract(
      externalTokens['wETH-lfETH'][0],
      IUniswapV2PairABI,
      provider
    );

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);

    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.LFBTC, this.LIFT, this.CTRL, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.wBTClfBTC = this.wBTClfBTC.connect(this.signer);
    this.lfBTCLIFT = this.lfBTCLIFT.connect(this.signer);
    //console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    //console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }

  // Pricing Functions from the Oracle

  async getwBTCPrice(): Promise<BigNumber> {
    const { Oracle } = this.contracts;
    return await Oracle.wbtcPriceOne();
  }

  async getwETHPrice(): Promise<BigNumber> {
    const { Oracle } = this.contracts;
    return await Oracle.wethPriceOne();
  }

  async getPegPrice(): Promise<BigNumber> {
    const { Oracle } = this.contracts;
    return await Oracle.priceOf(this.LFBTC.address);
  }

  async getPegETHPrice(): Promise<BigNumber> {
    const { Oracle } = this.contracts;
    return await Oracle.priceOf(this.LFETH.address);
  }

  async getControlPrice(): Promise<BigNumber> {
    const { Oracle } = this.contracts;
    return await Oracle.priceOf(this.CTRL.address);
  }

  async getSharePrice(): Promise<BigNumber> {
    const { Oracle } = this.contracts;
    return await Oracle.priceOf(this.LIFT.address);
  }

  async getPegStat(): Promise<TokenStat> {
    const wbtcPrice = Number(await this.getwBTCPrice());
    const pegPrice = Number(await this.getPegPrice());

    const pegInwBTC = pegPrice / wbtcPrice;

    return {
      priceInWBTC: String(pegInwBTC.toFixed(3)),
      totalSupply: await this.LFBTC.displayedTotalSupply(),
    };
  }

  async getPegEthStat(): Promise<TokenStat> {
    const wethPrice = Number(await this.getwETHPrice());
    const pegETHPrice = Number(await this.getPegETHPrice());

    const pegEthInwETH = pegETHPrice / wethPrice;

    return {
      priceInWBTC: String(pegEthInwETH.toFixed(3)),
      totalSupply: await this.LFETH.displayedTotalSupply(),
    };
  }

  async getControlStat(): Promise<TokenStat> {
    const controlPrice = Number(await this.getControlPrice()) / 1e18;

    return {
      priceInWBTC: String(controlPrice.toFixed(2)),
      totalSupply: await this.CTRL.displayedTotalSupply(),
    };
  }

  async getShareStat(): Promise<TokenStat> {
    const sharePrice = Number(await this.getSharePrice());

    const shareDollars = sharePrice / 1e18;

    return {
      priceInWBTC: String(shareDollars.toFixed(2)),
      totalSupply: await this.LIFT.displayedTotalSupply(),
    };
  }

  async getGenesisStat(): Promise<GenesisStats> {
    const { GenesisVault } = this.contracts;

    const stakeTokenPrice = await GenesisVault.getStakingTokenPrice();
    const stakeSupply = await GenesisVault.totalSupply();
    const totalwbtcMultiSupply = await GenesisVault.totalMultipliedWBTCTokens();

    return {
      wbtcSupply: Number(stakeSupply / 1e8),
      totalmultipliedwbtc: Number(totalwbtcMultiSupply / 1e8),
      //currentMultiplier: Number(formatUnits(await GenesisVault.currentMultiplier(), 0)).toFixed(0),
      totalStakedValue: new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD' }).format(Number(formatUnits(await GenesisVault.totalStakedValue(), 18))),
      stakingTokenPrice: new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD' }).format(Number(formatUnits(stakeTokenPrice, 18))),
      shareTokenPrice: new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD' }).format(Number(formatUnits(await GenesisVault.getShareTokenPrice(), 18))),
      stakepegPool: new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD' }).format(Number(formatUnits(stakeSupply.mul(2).mul(stakeTokenPrice), 26))),
      pegsharePool: new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD' }).format(Number(formatUnits(totalwbtcMultiSupply.mul(stakeTokenPrice), 26))),
    };
  }

  async getRedemptionStats(): Promise<WalletStats> {
    //test list
    // var address = "0x175aEEB6DeB82ca57BE942a29c8de7963Cc73367,0x699f324560E9236AfCFCeDbbfb9C4afA8fa9b042,0xc77fa6c05b4e472feee7c0f9b20e70c5bf33a99b,0xc0f9e8de7ce5ad40979de08b6b746ba47ca608cc,0x0e457324f0c6125b20392341cdeb7bf9bcb02322,0x2f45724d7e384b38d5c97206e78470544304887f,0x381cfd9e16bce03fcb35580490d4e5fa529c92e9,0xa25C2eC54d805689Db88F88F2c0EAe80649814Af";//,0x41e3fe77de1eca115902eb058b1fb57395358d62,0x461e76a4fe9f27605d4097a646837c32f1ccc31c,0x6232d7a6085d0ab8f885292078eeb723064a376b,0x861d0bc230a1babf3a4b0d9aa91d04cea38472f3,0x8e101059bd832496fc443d47ca2b6d0767b288df,0x9733ae7ececa99c8b1db998a7e8e37bcb3f68ae2,0xb1a9752d702b9e50db15e3b641d7098591752805,0xc61cc53572f07062731b21685f07fb1d71495fc9,0xc77fa6c05b4e472feee7c0f9b20e70c5bf33a99b,0xd0923192bcece5bcb3997e2578201c30813ae94c,0xd30391e21741c54c32987bcfca3d880e6d261cb0,0xdbda03aa9e624ba214f475b1007042d6cfd8e23e,0xee130cb5de16efa14930652c0a43bf7dd0e789ef,0xf44c4ed93f52a61d4c8e441c5b6c579d58d00a02,0xf79a02fefd0a51d470abc6a99776c4d9f8b93492,0x5be4cb2f7b2c8ab1b0aae6cf5aa4a1cc398aeb6d,0x67bcdfcdfc4f4ff2d6688a23717480548016e98d,0x7f825692dfae7107d16bf4e2071fe06b1bc72297,0x9ea72c9e316f10ce0dbe1bedcaa5ec4af281d4cd,0xbfe487aeda21a4fa369aaa7047f5a9c57263ec4a,0xc02bfc8c96477d82ae78d3212b802c4bfc820f90,0xec503c9fac9ccc823ab7f7cebe8953d7ee4cc5ac,0xf2b90042164e84a4f9599c8948d63a8ded7d29c1,0xfc0bbf4842a12c81834cd1fd3931cadaea99d388,0x13e46ccd194ca86212236543d2e7376b00bafa42,0x1fe063d56c4a59409302bddf5324df9de0d25b65,0x3049c80bdd527128eb4e7886ab1db1e8042a8eb7,0x702e9e66a100881039be7bbadacf1ba607c97f6b,0x7b1c99774cad13f8379c156833d1dc0ac31d24ee,0x8b98014819f95dfa353c69addf4e89a9b895c9c1,0x9822c731b38009a05384ffd757c854f71ce751f9,0xa2188a2d67fb39e386def087f43b9407aabe5c0e,0xd8e0016879fe8904988315317e622e48176820b6,0xd8ed830e33859af668bf4bf1550dfe4cc9984157,0xff5351a95c950964e14579716332eecac0118b20,0x0c0cda92ef4735549094752f56a522af28988f20,0x119be866300a4eec7d88d67f573d371a21b3ae88,0x120c154da31a0a3df84939713a52b6246887efa5,0x147b3d45d68cfe67b247dfb32f1f06e03e0686a7,0x15bdd87fe60e212c150d18d205766bda86350152,0x1b12399bc51c22bae041ea6b425440aae1ae4f40,0x1c4203db716a122aff5120203268113e8b471f0e,0x1eb110305820b8c1a64a0c2b348f6f6f72983789,0x21aa10ff06a366b642d034a6a0fcb1d88b9e804c,0x300406cc11ec10d55c1d2d9448e77fba8e4d2d8f,0x324e0b53cefa84cf970833939249880f814557c6,0x33d3c029fd119ebb90df20c3427a97074637bf7c,0x353c62f328f06ac08581daaa735dfadc0c3297f2,0x39de56518e136d472ef9645e7d6e1f7c6c8ed37b,0x3efb664f9a0a9b233c9cf0b5a89128faaa122677,0x40950267d12e979ad42974be5ac9a7e452f9505e,0x43bb52af6f921c63879d0f5d99dbf30344cd0498,0x464d876a94de8cbc957a81b15a5da34f2b66107a,0x499ee63ea49f4885b8aa25c1ec4c43df6b5c3925,0x519945de948ee442a779955d06c3013d360ca5da,0x524184efcd33ca329bb425ff5ddb6f167c60a87a,0x5588bbb679e5f0533ac08be2781f89cadf85dbbc,0x5fd19829167e9ca4fb86a3db4c80a26bfd53915d,0x62e1af3e818afc059d111c4f53cf0a2d9fd29110,0x6bdb8b2ef3bb27700a104dbc5903dd59c235beb4,0x6fe1611fa8afe46b973b0fa62c636fe213a2df28,0x755611a5f073138dd9b60131122051526629982c,0x7c106dbbd43ce6eb50838ee9df0a7700d2d0412d,0x7e97041d8a8a2a13ef6ee362003f5b52e49d0e83,0x87616fa850c87a78f307878f32d808dad8f4d401,0x8895175e28585b465347e47bdfeb467da6f3e991,0x8fe0404edbe8cef4e6d323d23074901bfab868e2,0x91093b33bef45a6ea850efaa68344c764b0ba220,0x9933fe78eb95f6871caa87e6bec5c0551a191eb0,0x9bba6257036c367e76baa8916725913a1ad60912,0xa25c2ec54d805689db88f88f2c0eae80649814af,0xa363e7b75817c7adac54903eba9c0c1819553bdc,0xaf772ba06451e6edcd3014753898de43d3722b4f,0xb2f22b8f50b8e57494caeea95b4a1a892f32157e,0xb4367abe9d87c508eceb60c422cbbf8e34aa8dc9,0xb86675529e8e6b0fe3b87d3abe3dc73ec7cbfd44,0xbf635c0b5a1500d8500dcde436aeca9d0ee10fdd,0xc0eb311c2f846bd359ed8eaa9a766d5e4736846a,0xc0f9e8de7ce5ad40979de08b6b746ba47ca608cc,0xc77c6eab64fb3986ceeae9a76081dd2097edcd0c,0xce6bc4ff23771ef4b4a4fcf2d7815f04790a19bd,0xce9965c9fdb9bb82fbf6311c85acbdf0f7207daa,0xd57d2337a8f5cf7601a5c0790c08d88a5223d64d,0xd995aedff50b2d3a030f74560bbd337819f24af1,0xdfcf69c8fed25f5150db719bad4efab64f628d31,0xe5dbff893e6120c0d013fb046cd755990e4be9a9,0xe5fcfca8519154ad9d73893e381db99fcafbf5af,0xe8623f6bc074339830a6d7dfe17c04e8f8cb2a4d,0xec8fd26fe6583b4e78c63aa8cf0b7c1835950b6a,0xf14d0b66cb9a4f5542c743a4049a0381f77c9046,0xf29372b28d188da7dd483c38c5c4daaf8204270b,0xf36f0047f2f5f67b253eee93e2f30896e1897ad0,0xfd6c9f9a367c18ab92d741758f1303d6067f1d60";
    // DIRTY LIFTERS
    var address = "0xf29372b28d188da7dd483c38c5c4daaf8204270b,0xec503c9fac9ccc823ab7f7cebe8953d7ee4cc5ac,0xdbda03aa9e624ba214f475b1007042d6cfd8e23e,0xce9965c9fdb9bb82fbf6311c85acbdf0f7207daa,0xc9f7da6253edd692dbdff3f74c8ce6ffedd64f42,0xbfe487aeda21a4fa369aaa7047f5a9c57263ec4a,0x9933fe78eb95f6871caa87e6bec5c0551a191eb0,0x41e3fe77de1eca115902eb058b1fb57395358d62,0x1eb110305820b8c1a64a0c2b348f6f6f72983789";
    var add_array = address.split(',');
    let wallets: WalletStats = [];
    var blockNum = 12774321;

    const { chainId } = this.config;
    const { Oracle } = this.contracts;

    const tsupwBTClfBTC = await this.wBTClfBTC.totalSupply();
    const tsupwETHlfETH = await this.wETHlfETH.totalSupply();
    const tsuplfBTCLIFT = await this.lfBTCLIFT.totalSupply();

    const { wBTC } = this.config.externalTokens;
    const tokenpegbtc0 = new Token(chainId, this.LFBTC.address, 18, "LFBTC", "LFBTC");
    const tokenpegbtc1 = new Token(chainId, wBTC[0], 8, "wBTC", "wBTC");

    const { wETH } = this.config.externalTokens;
    const tokenpegeth0 = new Token(chainId, this.LFETH.address, 18, "LFETH", "LFETH");
    const tokenpegeth1 = new Token(chainId, wETH[0], 18, "wETH", "wETH");

    const tokenlfbtc0 = new Token(chainId, this.LFBTC.address, 18, "LFBTC", "LFBTC");
    const tokenlift1 = new Token(chainId, this.LIFT.address, 18, "LIFT", "LIFT");

    const pair1 = await Fetcher.fetchPairData(tokenpegbtc0, tokenpegbtc1, this.provider);
    const pair2 = await Fetcher.fetchPairData(tokenpegeth0, tokenpegeth1, this.provider);
    const pair3 = await Fetcher.fetchPairData(tokenlfbtc0, tokenlift1, this.provider);
    
    //const pegbtc0 = BigNumber.from(Math.floor(Number(pair1.reserveOf(tokenpegbtc0).toFixed(2)) *100000 * 1e18 / 1e18));
    const pegbtc0 = BigNumber.from(1203750).toString();
    //const pegbtc1 = Number(pair1.reserveOf(tokenpegbtc1).toFixed(2));
    //const pegeth0 = BigNumber.from(Math.floor(Number(pair2.reserveOf(tokenpegeth0).toFixed(2)) *100000 * 1e18 / 1e18));
    const pegeth0 = BigNumber.from(14188479).toString();
    //const pegeth1 = Number(pair2.reserveOf(tokenpegeth1).toFixed(2));
    //const lfbtc0 = BigNumber.from(Math.floor(Number(pair3.reserveOf(tokenlfbtc0).toFixed(2)) *100000 * 1e18 / 1e18));
    const lfbtc0 = BigNumber.from(2943923).toString();
    //const lift1 = BigNumber.from(Math.floor(Number(pair3.reserveOf(tokenlift1).toFixed(2)) *100000 * 1e18 / 1e18));
    const lift1 = BigNumber.from(7398617852).toString();

    // console.log(pegbtc0.toString());
    // console.log(BigNumber.from(1203750).toString());
    // console.log(pegeth0.toString());
    // console.log(BigNumber.from(14188479).toString());
    // console.log(lfbtc0.toString());
    // console.log(BigNumber.from(2943923).toString());
    // console.log(lift1.toString());
    // console.log(BigNumber.from(7398617852).toString());

    console.log(await this.contracts.wBTClfBTCH.balanceOf(addstr, {blockTag: blockNum}));

    for(var i = 0; i < add_array.length; i++) {
      var addstr = add_array[i];

      const {0: ctrlv1, 1: ctrlv2} = await this.contracts.Boardroom.earned(addstr); 

      let w: WalletStatsAttributes = {
      walletAddress: addstr,
      
      lfbtcSupplyGenesis: (((await this.lfBTCLIFT.balanceOf(addstr, {blockTag: blockNum})).add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(addstr, {blockTag: blockNum}))).mul(100000).div(tsuplfBTCLIFT).mul(lfbtc0).mul(1e8)),
      lfbtcSupply: (await this.LFBTC.balanceOfNum(addstr, blockNum))
          .add(((await this.wBTClfBTC.balanceOf(addstr, {blockTag: blockNum})).add(await this.contracts.wBTClfBTCH.balanceOf(addstr, {blockTag: blockNum})).add(await this.contracts.wBTClfBTCLPTokenSharePool.balanceOf(addstr, {blockTag: blockNum}))).mul(100000).div(tsupwBTClfBTC).mul(pegbtc0).mul(1e8)),
      lfethSupply: (await this.LFETH.balanceOfNum(addstr, blockNum))
          .add((await this.wETHlfETH.balanceOf(addstr, {blockTag: blockNum})).add(await this.contracts.wETHlfETHLPTokenSharePool.balanceOf(addstr, {blockTag: blockNum}))).mul(100000).div(tsupwETHlfETH).mul(pegeth0).mul(1e8),
      liftSupplyGenesis: ((await this.lfBTCLIFT.balanceOf(addstr,{blockTag: blockNum}))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(addstr, {blockTag: blockNum}))).mul(100000).div(tsuplfBTCLIFT).mul(lift1).mul(1e8),
      liftSupply: (await this.LIFT.balanceOfNum(addstr, blockNum))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.earned(addstr, {blockTag: blockNum}))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.earned(addstr, {blockTag: blockNum}))
          .add(await this.contracts.wETHlfETHLPTokenSharePool.earned(addstr, {blockTag: blockNum}))
          .add(await this.contracts.Boardroom.getbalanceOfShare(addstr, {blockTag: blockNum})),              
      ctrlSupply: (await this.contracts.Boardroom.getbalanceOfControl(addstr, {blockTag: blockNum}))
          .add(ctrlv1).add(ctrlv2),
      ctrlInWallet: (await this.CTRL.balanceOfNum(addstr, blockNum)),    
      }

      console.log(i);

      wallets.push(w);
    }

    return wallets;
  }

  async getRedemptionStatsSingle(addressIn: string): Promise<WalletStats> {
    //test list
    // var address = "0x175aEEB6DeB82ca57BE942a29c8de7963Cc73367,0x699f324560E9236AfCFCeDbbfb9C4afA8fa9b042,0xc77fa6c05b4e472feee7c0f9b20e70c5bf33a99b,0xc0f9e8de7ce5ad40979de08b6b746ba47ca608cc,0x0e457324f0c6125b20392341cdeb7bf9bcb02322,0x2f45724d7e384b38d5c97206e78470544304887f,0x381cfd9e16bce03fcb35580490d4e5fa529c92e9,0xa25C2eC54d805689Db88F88F2c0EAe80649814Af";//,0x41e3fe77de1eca115902eb058b1fb57395358d62,0x461e76a4fe9f27605d4097a646837c32f1ccc31c,0x6232d7a6085d0ab8f885292078eeb723064a376b,0x861d0bc230a1babf3a4b0d9aa91d04cea38472f3,0x8e101059bd832496fc443d47ca2b6d0767b288df,0x9733ae7ececa99c8b1db998a7e8e37bcb3f68ae2,0xb1a9752d702b9e50db15e3b641d7098591752805,0xc61cc53572f07062731b21685f07fb1d71495fc9,0xc77fa6c05b4e472feee7c0f9b20e70c5bf33a99b,0xd0923192bcece5bcb3997e2578201c30813ae94c,0xd30391e21741c54c32987bcfca3d880e6d261cb0,0xdbda03aa9e624ba214f475b1007042d6cfd8e23e,0xee130cb5de16efa14930652c0a43bf7dd0e789ef,0xf44c4ed93f52a61d4c8e441c5b6c579d58d00a02,0xf79a02fefd0a51d470abc6a99776c4d9f8b93492,0x5be4cb2f7b2c8ab1b0aae6cf5aa4a1cc398aeb6d,0x67bcdfcdfc4f4ff2d6688a23717480548016e98d,0x7f825692dfae7107d16bf4e2071fe06b1bc72297,0x9ea72c9e316f10ce0dbe1bedcaa5ec4af281d4cd,0xbfe487aeda21a4fa369aaa7047f5a9c57263ec4a,0xc02bfc8c96477d82ae78d3212b802c4bfc820f90,0xec503c9fac9ccc823ab7f7cebe8953d7ee4cc5ac,0xf2b90042164e84a4f9599c8948d63a8ded7d29c1,0xfc0bbf4842a12c81834cd1fd3931cadaea99d388,0x13e46ccd194ca86212236543d2e7376b00bafa42,0x1fe063d56c4a59409302bddf5324df9de0d25b65,0x3049c80bdd527128eb4e7886ab1db1e8042a8eb7,0x702e9e66a100881039be7bbadacf1ba607c97f6b,0x7b1c99774cad13f8379c156833d1dc0ac31d24ee,0x8b98014819f95dfa353c69addf4e89a9b895c9c1,0x9822c731b38009a05384ffd757c854f71ce751f9,0xa2188a2d67fb39e386def087f43b9407aabe5c0e,0xd8e0016879fe8904988315317e622e48176820b6,0xd8ed830e33859af668bf4bf1550dfe4cc9984157,0xff5351a95c950964e14579716332eecac0118b20,0x0c0cda92ef4735549094752f56a522af28988f20,0x119be866300a4eec7d88d67f573d371a21b3ae88,0x120c154da31a0a3df84939713a52b6246887efa5,0x147b3d45d68cfe67b247dfb32f1f06e03e0686a7,0x15bdd87fe60e212c150d18d205766bda86350152,0x1b12399bc51c22bae041ea6b425440aae1ae4f40,0x1c4203db716a122aff5120203268113e8b471f0e,0x1eb110305820b8c1a64a0c2b348f6f6f72983789,0x21aa10ff06a366b642d034a6a0fcb1d88b9e804c,0x300406cc11ec10d55c1d2d9448e77fba8e4d2d8f,0x324e0b53cefa84cf970833939249880f814557c6,0x33d3c029fd119ebb90df20c3427a97074637bf7c,0x353c62f328f06ac08581daaa735dfadc0c3297f2,0x39de56518e136d472ef9645e7d6e1f7c6c8ed37b,0x3efb664f9a0a9b233c9cf0b5a89128faaa122677,0x40950267d12e979ad42974be5ac9a7e452f9505e,0x43bb52af6f921c63879d0f5d99dbf30344cd0498,0x464d876a94de8cbc957a81b15a5da34f2b66107a,0x499ee63ea49f4885b8aa25c1ec4c43df6b5c3925,0x519945de948ee442a779955d06c3013d360ca5da,0x524184efcd33ca329bb425ff5ddb6f167c60a87a,0x5588bbb679e5f0533ac08be2781f89cadf85dbbc,0x5fd19829167e9ca4fb86a3db4c80a26bfd53915d,0x62e1af3e818afc059d111c4f53cf0a2d9fd29110,0x6bdb8b2ef3bb27700a104dbc5903dd59c235beb4,0x6fe1611fa8afe46b973b0fa62c636fe213a2df28,0x755611a5f073138dd9b60131122051526629982c,0x7c106dbbd43ce6eb50838ee9df0a7700d2d0412d,0x7e97041d8a8a2a13ef6ee362003f5b52e49d0e83,0x87616fa850c87a78f307878f32d808dad8f4d401,0x8895175e28585b465347e47bdfeb467da6f3e991,0x8fe0404edbe8cef4e6d323d23074901bfab868e2,0x91093b33bef45a6ea850efaa68344c764b0ba220,0x9933fe78eb95f6871caa87e6bec5c0551a191eb0,0x9bba6257036c367e76baa8916725913a1ad60912,0xa25c2ec54d805689db88f88f2c0eae80649814af,0xa363e7b75817c7adac54903eba9c0c1819553bdc,0xaf772ba06451e6edcd3014753898de43d3722b4f,0xb2f22b8f50b8e57494caeea95b4a1a892f32157e,0xb4367abe9d87c508eceb60c422cbbf8e34aa8dc9,0xb86675529e8e6b0fe3b87d3abe3dc73ec7cbfd44,0xbf635c0b5a1500d8500dcde436aeca9d0ee10fdd,0xc0eb311c2f846bd359ed8eaa9a766d5e4736846a,0xc0f9e8de7ce5ad40979de08b6b746ba47ca608cc,0xc77c6eab64fb3986ceeae9a76081dd2097edcd0c,0xce6bc4ff23771ef4b4a4fcf2d7815f04790a19bd,0xce9965c9fdb9bb82fbf6311c85acbdf0f7207daa,0xd57d2337a8f5cf7601a5c0790c08d88a5223d64d,0xd995aedff50b2d3a030f74560bbd337819f24af1,0xdfcf69c8fed25f5150db719bad4efab64f628d31,0xe5dbff893e6120c0d013fb046cd755990e4be9a9,0xe5fcfca8519154ad9d73893e381db99fcafbf5af,0xe8623f6bc074339830a6d7dfe17c04e8f8cb2a4d,0xec8fd26fe6583b4e78c63aa8cf0b7c1835950b6a,0xf14d0b66cb9a4f5542c743a4049a0381f77c9046,0xf29372b28d188da7dd483c38c5c4daaf8204270b,0xf36f0047f2f5f67b253eee93e2f30896e1897ad0,0xfd6c9f9a367c18ab92d741758f1303d6067f1d60";
    // DIRTY LIFTERS
    //var address = addressIn;//"0xf29372b28d188da7dd483c38c5c4daaf8204270b,0xec503c9fac9ccc823ab7f7cebe8953d7ee4cc5ac,0xdbda03aa9e624ba214f475b1007042d6cfd8e23e,0xce9965c9fdb9bb82fbf6311c85acbdf0f7207daa,0xc9f7da6253edd692dbdff3f74c8ce6ffedd64f42,0xbfe487aeda21a4fa369aaa7047f5a9c57263ec4a,0x9933fe78eb95f6871caa87e6bec5c0551a191eb0,0x41e3fe77de1eca115902eb058b1fb57395358d62,0x1eb110305820b8c1a64a0c2b348f6f6f72983789";
    //var add_array = address.split(',');
    let wallets: WalletStats = [];
    var blockNum = 12774321;

    const { chainId } = this.config;
    const { Oracle } = this.contracts;

    var tsupwBTClfBTC = await this.wBTClfBTC.totalSupply({blockTag: blockNum});
    var tsupwETHlfETH = await this.wETHlfETH.totalSupply({blockTag: blockNum});
    var tsuplfBTCLIFT = await this.lfBTCLIFT.totalSupply({blockTag: blockNum});

    const { wBTC } = this.config.externalTokens;
    const tokenpegbtc0 = new Token(chainId, this.LFBTC.address, 18, "LFBTC", "LFBTC");
    const tokenpegbtc1 = new Token(chainId, wBTC[0], 8, "wBTC", "wBTC");

    const { wETH } = this.config.externalTokens;
    const tokenpegeth0 = new Token(chainId, this.LFETH.address, 18, "LFETH", "LFETH");
    const tokenpegeth1 = new Token(chainId, wETH[0], 18, "wETH", "wETH");

    const tokenlfbtc0 = new Token(chainId, this.LFBTC.address, 18, "LFBTC", "LFBTC");
    const tokenlift1 = new Token(chainId, this.LIFT.address, 18, "LIFT", "LIFT");

    const pair1 = await Fetcher.fetchPairData(tokenpegbtc0, tokenpegbtc1, this.provider);
    const pair2 = await Fetcher.fetchPairData(tokenpegeth0, tokenpegeth1, this.provider);
    const pair3 = await Fetcher.fetchPairData(tokenlfbtc0, tokenlift1, this.provider);
    
    //const pegbtc0 = BigNumber.from(Math.floor(Number(pair1.reserveOf(tokenpegbtc0).toFixed(2)) *100000 * 1e18 / 1e18));
    var pegbtc0 = BigNumber.from(1203750).toString();
    //const pegbtc1 = Number(pair1.reserveOf(tokenpegbtc1).toFixed(2));
    //const pegeth0 = BigNumber.from(Math.floor(Number(pair2.reserveOf(tokenpegeth0).toFixed(2)) *100000 * 1e18 / 1e18));
    var pegeth0 = BigNumber.from(14188479).toString();
    //const pegeth1 = Number(pair2.reserveOf(tokenpegeth1).toFixed(2));
    //const lfbtc0 = BigNumber.from(Math.floor(Number(pair3.reserveOf(tokenlfbtc0).toFixed(2)) *100000 * 1e18 / 1e18));
    var lfbtc0 = BigNumber.from(2943923).toString();
    //const lift1 = BigNumber.from(Math.floor(Number(pair3.reserveOf(tokenlift1).toFixed(2)) *100000 * 1e18 / 1e18));
    var lift1 = BigNumber.from(7398617852).toString();

    var addstr = addressIn;

    
//console.log((await this.lfBTCLIFT.balanceOf(addstr, {blockTag: blockNum})));
//console.log((await this.wBTClfBTCH.balanceOf(addstr, {blockTag: blockNum})).toString());


      var {0: ctrlv1, 1: ctrlv2} = await this.contracts.Boardroom.earned(addstr, {blockTag: blockNum}); 

      let w: WalletStatsAttributes = {
      walletAddress: "Amounts at Block Snapshot: " + addstr,
      
      lfbtcSupplyGenesis: (((await this.lfBTCLIFT.balanceOf(addstr, {blockTag: blockNum})).add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(addstr, {blockTag: blockNum}))).mul(100000).div(tsuplfBTCLIFT).mul(lfbtc0).mul(1e8)),
      lfbtcSupply: (await this.LFBTC.balanceOfNum(addstr, blockNum))
          .add(((await this.wBTClfBTC.balanceOf(addstr, {blockTag: blockNum})).add(await this.wBTClfBTCH.balanceOf(addstr, {blockTag: blockNum})).add(await this.contracts.wBTClfBTCLPTokenSharePool.balanceOf(addstr, {blockTag: blockNum}))).mul(100000).div(tsupwBTClfBTC).mul(pegbtc0).mul(1e8))
          .add((await this.lfBTCLIFTH.balanceOf(addstr, {blockTag: blockNum})).mul(100000).div(tsuplfBTCLIFT).mul(lfbtc0).mul(1e8)),
      lfethSupply: (await this.LFETH.balanceOfNum(addstr, blockNum))
          .add((await this.wETHlfETH.balanceOf(addstr, {blockTag: blockNum})).add(await this.contracts.wETHlfETHLPTokenSharePool.balanceOf(addstr, {blockTag: blockNum}))).mul(100000).div(tsupwETHlfETH).mul(pegeth0).mul(1e8),
      liftSupplyGenesis: ((await this.lfBTCLIFT.balanceOf(addstr,{blockTag: blockNum}))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(addstr, {blockTag: blockNum}))).mul(100000).div(tsuplfBTCLIFT).mul(lift1).mul(1e8),
      liftSupply: (await this.LIFT.balanceOfNum(addstr, blockNum))
          .add((await this.lfBTCLIFTH.balanceOf(addstr, {blockTag: blockNum})).mul(100000).div(tsuplfBTCLIFT).mul(lift1).mul(1e8))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.earned(addstr, {blockTag: blockNum}))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.earned(addstr, {blockTag: blockNum}))
          .add(await this.contracts.wETHlfETHLPTokenSharePool.earned(addstr, {blockTag: blockNum}))
          .add(await this.contracts.Boardroom.getbalanceOfShare(addstr, {blockTag: blockNum})),              
      ctrlSupply: (await this.contracts.Boardroom.getbalanceOfControl(addstr, {blockTag: blockNum}))
          .add(ctrlv2).add(ctrlv1),
      ctrlInWallet: (await this.CTRL.balanceOfNum(addstr, blockNum)),
      }

      wallets.push(w);

      tsupwBTClfBTC = await this.wBTClfBTC.totalSupply();
      tsupwETHlfETH = await this.wETHlfETH.totalSupply();
      tsuplfBTCLIFT = await this.lfBTCLIFT.totalSupply();
      var {0: ctrlv1, 1: ctrlv2} = await this.contracts.Boardroom.earned(addstr); 

      pegbtc0 = BigNumber.from(Math.floor(Number(pair1.reserveOf(tokenpegbtc0).toFixed(2)) *100000 * 1e18 / 1e18)).toString();
      //const pegbtc0 = BigNumber.from(1203750).toString();
      //const pegbtc1 = Number(pair1.reserveOf(tokenpegbtc1).toFixed(2));
      pegeth0 = BigNumber.from(Math.floor(Number(pair2.reserveOf(tokenpegeth0).toFixed(2)) *100000 * 1e18 / 1e18)).toString();
      //const pegeth0 = BigNumber.from(14188479).toString();
      //const pegeth1 = Number(pair2.reserveOf(tokenpegeth1).toFixed(2));
      lfbtc0 = BigNumber.from(Math.floor(Number(pair3.reserveOf(tokenlfbtc0).toFixed(2)) *100000 * 1e18 / 1e18)).toString();
      //const lfbtc0 = BigNumber.from(2943923).toString();
      lift1 = BigNumber.from(Math.floor(Number(pair3.reserveOf(tokenlift1).toFixed(2)) *100000 * 1e18 / 1e18)).toString();
      //const lift1 = BigNumber.from(7398617852).toString();

      //const {0: ctrlv1, 1: ctrlv2} = await this.contracts.Boardroom.earned(addstr); 

      let wNow: WalletStatsAttributes = {
      walletAddress: "Current Amounts for: " + addstr,
      
      lfbtcSupplyGenesis: (((await this.lfBTCLIFT.balanceOf(addstr)).add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(addstr))).mul(100000).div(tsuplfBTCLIFT).mul(lfbtc0).mul(1e8)),
      lfbtcSupply: (await this.LFBTC.balanceOf(addstr))
          .add(((await this.wBTClfBTC.balanceOf(addstr)).add(await this.wBTClfBTCH.balanceOf(addstr)).add(await this.contracts.wBTClfBTCLPTokenSharePool.balanceOf(addstr))).mul(100000).div(tsupwBTClfBTC).mul(pegbtc0).mul(1e8))
          .add((await this.lfBTCLIFTH.balanceOf(addstr)).mul(100000).div(tsuplfBTCLIFT).mul(lfbtc0).mul(1e8)),
      lfethSupply: (await this.LFETH.balanceOf(addstr))
          .add(((await this.wETHlfETH.balanceOf(addstr)).add(await this.contracts.wETHlfETHLPTokenSharePool.balanceOf(addstr))).mul(100000).div(tsupwETHlfETH).mul(pegeth0).mul(1e8)),
      liftSupplyGenesis: ((await this.lfBTCLIFT.balanceOf(addstr))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(addstr))).mul(100000).div(tsuplfBTCLIFT).mul(lift1).mul(1e8),
      liftSupply: (await this.LIFT.balanceOf(addstr))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.earned(addstr))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.earned(addstr))
          .add(await this.contracts.wETHlfETHLPTokenSharePool.earned(addstr))
          .add(await this.contracts.Boardroom.getbalanceOfShare(addstr)),              
      ctrlSupply: (await this.contracts.Boardroom.getbalanceOfControl(addstr))
          .add(ctrlv2).add(ctrlv1),
      ctrlInWallet: (await this.CTRL.balanceOf(addstr)),
      }

      wallets.push(wNow);

    return wallets;
  }

  async getIdeaFundStat(): Promise<IdeaFundStats> {
    const { IdeaFund } = this.contracts;
    const wBTC = this.externalTokens['wBTC'];
    const wETH = this.externalTokens['wETH'];

    const mcroboString = "0x8F90D3715Bd151fBb6b8A86c566f67c5a0719B79";
    const ifPrivateString = "0x3a7E63fAe8EFa9408aC8DfB988808BB86674Bde5";
    const ifContractString = "0x0598B812F79df854409641bce01392FeA921f11E";

    const {0: tsvalue1, 1: tsvalue2} = await this.contracts.Boardroom.earned(mcroboString);
    const {0: ifpsvalue1, 1: ifpsvalue2} = await this.contracts.Boardroom.earned(ifPrivateString);
    const {0: ifcsvalue1, 1: ifcsvalue2} = await this.contracts.Boardroom.earned(ifContractString);
    
    return {
      teamWallet: {
        walletAddress: mcroboString,
        walletName: "MyCryptoRobo Wallet",
        wbtcSupply: await wBTC.balanceOf(mcroboString),
        lfbtcSupply: await this.LFBTC.balanceOf(mcroboString),
        wethSupply: await this.provider.getBalance(mcroboString),
        lfethSupply: await this.LFETH.balanceOf(mcroboString),
        liftSupply: (await this.LIFT.balanceOf(mcroboString))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.earned(mcroboString))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.earned(mcroboString))
          .add(await this.contracts.Boardroom.getbalanceOfShare(mcroboString)),
        ctrlSupply: (await this.CTRL.balanceOf(mcroboString))
          .add(await this.contracts.Boardroom.getbalanceOfControl(mcroboString))
          .add(tsvalue1).add(tsvalue2),
        pegPairSupply: (await this.wBTClfBTC.balanceOf(mcroboString))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.balanceOf(mcroboString)),
        sharePairSupply: (await this.lfBTCLIFT.balanceOf(mcroboString))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(mcroboString)),
        pegEthPairSupply: BigNumber.from(0),
        haifSupply: await this.HAIF.balanceOf(mcroboString),
      },
      ideaFundPrivateWallet: {
        walletAddress: ifPrivateString,
        walletName: "IdeaFund Combined Wallet",
        wbtcSupply: (await wBTC.balanceOf(ifPrivateString)).add(await wBTC.balanceOf(ifContractString)),
        lfbtcSupply: (await this.LFBTC.balanceOf(ifPrivateString)).add(await this.LFBTC.balanceOf(ifContractString)),
        wethSupply: (await this.provider.getBalance(ifPrivateString)).add(await this.provider.getBalance(ifContractString)),
        lfethSupply: (await this.LFETH.balanceOf(ifPrivateString)).add(await this.LFETH.balanceOf(ifContractString)),
        liftSupply: (await this.LIFT.balanceOf(ifPrivateString))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.earned(ifPrivateString))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.earned(ifPrivateString))
          .add(await this.contracts.Boardroom.getbalanceOfShare(ifPrivateString))
          .add(await this.LIFT.balanceOf(ifContractString))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.earned(ifContractString))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.earned(ifContractString))
          .add(await this.contracts.Boardroom.getbalanceOfShare(ifContractString)),
        ctrlSupply: (await this.CTRL.balanceOf(ifPrivateString))
          .add(await this.contracts.Boardroom.getbalanceOfControl(ifPrivateString))
          .add(ifpsvalue1).add(ifpsvalue2)
          .add(await this.CTRL.balanceOf(ifContractString))
          .add(await this.contracts.Boardroom.getbalanceOfControl(ifContractString))
          .add(ifcsvalue1).add(ifcsvalue2),
        pegPairSupply: (await this.wBTClfBTC.balanceOf(ifPrivateString))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.balanceOf(ifPrivateString))
          .add(await this.wBTClfBTC.balanceOf(ifContractString))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.balanceOf(ifContractString)),
        sharePairSupply: (await this.lfBTCLIFT.balanceOf(ifPrivateString))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(ifPrivateString))
          .add(await this.lfBTCLIFT.balanceOf(ifContractString))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(ifContractString)),
        pegEthPairSupply: (await this.wETHlfETH.balanceOf(ifPrivateString))
          .add(await this.contracts.wETHlfETHLPTokenSharePool.balanceOf(ifPrivateString))
          .add(await this.wETHlfETH.balanceOf(ifContractString))
          .add(await this.contracts.wETHlfETHLPTokenSharePool.balanceOf(ifContractString)),
        haifSupply: (await this.HAIF.balanceOf(ifPrivateString)).add(await this.HAIF.balanceOf(ifContractString)),
      },
      ideaFundWallet: {
        walletAddress: ifContractString,
        walletName: "IdeaFund Contract Wallet",
        wbtcSupply: await wBTC.balanceOf(ifContractString),
        lfbtcSupply: await this.LFBTC.balanceOf(ifContractString),
        wethSupply: await this.provider.getBalance(ifContractString),
        lfethSupply: await this.LFETH.balanceOf(ifContractString),
        liftSupply: (await this.LIFT.balanceOf(ifContractString))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.earned(ifContractString))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.earned(ifContractString))
          .add(await this.contracts.Boardroom.getbalanceOfShare(ifContractString)),
        ctrlSupply: (await this.CTRL.balanceOf(ifContractString))
          .add(await this.contracts.Boardroom.getbalanceOfControl(ifContractString))
          .add(ifcsvalue1).add(ifcsvalue2),
        pegPairSupply: (await this.wBTClfBTC.balanceOf(ifContractString))
          .add(await this.contracts.wBTClfBTCLPTokenSharePool.balanceOf(ifContractString)),
        sharePairSupply: (await this.lfBTCLIFT.balanceOf(ifContractString))
          .add(await this.contracts.lfBTCLIFTLPTokenSharePool.balanceOf(ifContractString)),
        pegEthPairSupply: BigNumber.from(0),
        haifSupply: await this.HAIF.balanceOf(ifContractString),
      },
    };
  }

  async getPoolValue(poolName: ContractName): Promise<BigNumber> {
    const { chainId } = this.config;
    const { Oracle } = this.contracts;

    const poolValue = 0;

      if(poolName.includes("LIFT")) {
        const token0 = new Token(chainId, this.LFBTC.address, 18, "LFBTC", "LFBTC");
        const token1 = new Token(chainId, this.LIFT.address, 18, "LIFT", "LIFT");

        const pair = await Fetcher.fetchPairData(token0, token1, this.provider);

        if (pair === null) {
          return BigNumber.from(0);
        } 
        const s0 = pair.reserveOf(token0);
        const s1 = pair.reserveOf(token1);
        const r0 = Number(s0.toFixed(2));
        const v0 = Number(await Oracle.priceOf(token0.address));
        const r1 = Number(s1.toFixed(2));
        const v1 = Number(await Oracle.priceOf(token1.address));

        const oneup = ((r0 * v0) + (r1 * v1)) / 1e18;
        //console.log(oneup.toFixed(0));
        return BigNumber.from(Math.floor(oneup));

      } else if (poolName.includes("wBTC")) {

        const { wBTC } = this.config.externalTokens;
        const token0 = new Token(chainId, this.LFBTC.address, 18, "LFBTC", "LFBTC");
        const token1 = new Token(chainId, wBTC[0], 8, "wBTC", "wBTC");

        const pair = await Fetcher.fetchPairData(token0, token1, this.provider);
        
        if (pair === null) {
          return BigNumber.from(0);
        } 
        const s0 = pair.reserveOf(token0);
        const s1 = pair.reserveOf(token1);
        const r0 = Number(s0.toFixed(2));
        const v0 = Number(await Oracle.priceOf(token0.address));
        const r1 = Number(s1.toFixed(2));
        const v1 = Number(await Oracle.priceOf(token1.address));

        const oneup = ((r0 * v0) + (r1 * v1)) / 1e18;
        //console.log(oneup.toFixed(0));
        return BigNumber.from(Math.floor(oneup));
      } else if (poolName.includes("wETH")) {

        const { wETH } = this.config.externalTokens;
        const token0 = new Token(chainId, this.LFETH.address, 18, "LFETH", "LFETH");
        const token1 = new Token(chainId, wETH[0], 18, "wETH", "wETH");

        const pair = await Fetcher.fetchPairData(token0, token1, this.provider);
        
        if (pair === null) {
          return BigNumber.from(0);
        } 
        const s0 = pair.reserveOf(token0);
        const s1 = pair.reserveOf(token1);
        const r0 = Number(s0.toFixed(2));
        const v0 = Number(await Oracle.priceOf(token0.address));
        const r1 = Number(s1.toFixed(2));
        const v1 = Number(await Oracle.priceOf(token1.address));

        const oneup = ((r0 * v0) + (r1 * v1)) / 1e18;
        //console.log(oneup.toFixed(0));
        return BigNumber.from(Math.floor(oneup));
      }

      return BigNumber.from(0);
  }

  async earnedFromBank(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.earned(account);
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(
    poolName: ContractName,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.balanceOf(account);
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //const gas = await pool.estimateGas.stake(amount);
    return await pool.stake(amount);
  }

  // /**
  //  * Withdraws token from given pool.
  //  * @param poolName A name of pool contract.
  //  * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
  //  * @returns {string} Transaction hash
  //  */
  async unstake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //const gas = await pool.estimateGas.withdraw(amount);
    return await pool.withdraw(amount);
  }

  // /**
  //  * Transfers earned token reward from given pool to my account.
  //  */
  async harvest(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //const gas = await pool.estimateGas.getReward();
    return await pool.stakeInBoardroom();
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    try {
      return await pool.exit();
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return;
    }
  }

  currentBoardroom(): Contract {
    return this.contracts.Boardroom
  }

  genesisVault(): Contract {
    return this.contracts.GenesisVault
  }

  ideaFund(): Contract {
    const { IdeaFund } = this.contracts;
    return IdeaFund;
  }

  async buyCTRL(address: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    return await this.contracts.IdeaFund.buyCTRL(address, amount);
  }

  async redeemCTRL(amount: BigNumber): Promise<TransactionResponse> {
    return await this.contracts.IdeaFund.redeemCTRL(amount);
  }

  async getBalanceOfHAIF(address: ContractName): Promise<BigNumber>{
    return await this.contracts.HAIF.balanceOf(address);
  }

  async getBalanceOfwBTC(address: ContractName): Promise<BigNumber>{
    return await this.contracts.wBTC.balanceOf(address);
  }

  async getBalanceOfCTRL(address: ContractName): Promise<BigNumber>{
    return await this.contracts.CTRL.balanceOf(address);
  }

  async getBalanceOfLFBTC(address: ContractName): Promise<BigNumber>{
    return await this.contracts.LFBTC.balanceOf(address);
  }

  async getBalanceOfwBTCLP(address: ContractName): Promise<BigNumber>{
    return await this.contracts.wBTClfBTC.balanceOf(address);
  }

  async getBalanceOfLIFTLP(address: ContractName): Promise<BigNumber>{
    return await this.contracts.lfBTCLIFT.balanceOf(address);
  }

  async stakeShareToGenesis(amount: BigNumber, term: Number): Promise<TransactionResponse>{
    return await this.contracts.GenesisVault.stake(amount.toString(), term);
  }

  async stakeShareToBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.stakeShare(decimalToBalance(amount));
  }

  async stakeControlToBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    //console.log("Control to stake: ", amount);
    return await Boardroom.stakeControl(decimalToBalance(amount));
  }

  async getStakedControlOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.getbalanceOfControl(this.myAccount);
  }

  async getExpansionValue(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return await Treasury.expansionPercentage();
  }

  async getDevFundRate(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return await Treasury.devfundAllocationRate();
  }

  async getIdeaFundRate(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return await Treasury.ideafundAllocationRate();
  }

  async getBoardroomStats(): Promise<BoardroomStats> {
    const personalControl = await this.getStakedControlOnBoardroom();
    const personalShare = await this.getStakedAmountsShare();
    const expansionValue = await this.getExpansionValue();
    const devfundRate = await this.getDevFundRate();
    const ideafundRate = await this.getIdeaFundRate();
    const totalSupplyControl = await this.currentBoardroom().gettotalSupplyControl();   
    const totalSupplyShare = await this.currentBoardroom().gettotalSupplyShare();
    const totalSupplyPeg = await this.LFBTC.totalSupply();
    const valueOfControl = await this.getControlPrice();
    const valueOfShare = await this.getSharePrice();
    const valueOfPeg = await this.getwBTCPrice();
    
    const totalValueBoardroom = Number((((Number(totalSupplyControl) * Number(valueOfControl) / Number(1e18)) + (Number(totalSupplyShare) * Number(valueOfShare) / Number(1e18))) / Number(1e18)).toFixed(2));

    const personalValueBoardroom = Number((((Number(personalControl) * Number(valueOfControl) / Number(1e18)) + (Number(personalShare.totalStakingAmount) * Number(valueOfShare) / Number(1e18))) / Number(1e18)).toFixed(2));

    const personalExpansion = personalValueBoardroom * Number(1e10) / Number(totalValueBoardroom);
    const controlExpansion = ((Number(totalSupplyPeg) * (100 + Number(expansionValue))) / (100 + Number(100) - Number(devfundRate) - Number(ideafundRate))) * Number(valueOfPeg) / Number(valueOfControl);

    const finalExpansion = Number((personalExpansion * controlExpansion / (1e12) / (1e18)).toFixed(6));

    const finalValue = Number((finalExpansion * Number(valueOfControl) / (1e18)).toFixed(2));
    
    return {
      totalSupplyControl,
      totalSupplyShare,
      totalSupplyPeg,
      totalValueBoardroom,
      personalValueBoardroom,
      finalExpansion,
      finalValue,
      valueOfControl,
      valueOfShare,
      valueOfPeg,
      personalControl,
      personalShare,
      expansionValue,
      devfundRate,
      ideafundRate
    };
  }

  async gettotalSupplyControl(): Promise<BigNumber> {
    return await this.currentBoardroom().gettotalSupplyControl();
  }

  async gettotalSupplyShare(): Promise<BigNumber>{
    return await this.currentBoardroom().gettotalSupplyShare();
  }

  async getStakedAmountsShare(): Promise<stakingShareSummary> {
    var stakingShares = new Array<stakingShare>();

    const stakingShareEvents = await this.currentBoardroom().getStakedAmountsShare();
    let totalStakingAmount = BigNumber.from(0);
    for (var stakingShareEvent of stakingShareEvents) {
      totalStakingAmount = totalStakingAmount.add(stakingShareEvent[0]);

      stakingShares.push({
          amount: stakingShareEvent[0],
          timestamp: stakingShareEvent[1],
        });
    }

    return {
      totalStakingAmount,
      stakingShares
    };
  }

  async getEarningsOnBoardroom(): Promise<earnedValue> {
    const Boardroom = this.currentBoardroom();
    const {0: value1, 1: value2, } = await Boardroom.earned(this.myAccount);

    return {
      shareValue: value1,
      controlValue: value2,
    };
  }

  async withdrawAllShareFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdrawShareDontCallMeUnlessYouAreCertain();
  }

  async withdrawShareFromBoardroom(time: BigNumber): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdrawShare(time);
  }

  async withdrawControlFromBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdrawControl(decimalToBalance(amount));
  }

  async harvestCTRLFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.claimReward();
  }

  async getTreasuryNextAllocationTime(): Promise<TreasuryAllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const period: BigNumber = await Treasury.getPeriod();

    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(nextAllocation.getTime() - period.toNumber() * 1000);
    return { prevAllocation, nextAllocation };
  }

  //ADMIN Functions at work
  async cleanUpDustIdeaFund(amount: BigNumber, token: String, sendto: String): Promise<TransactionResponse> {
    return await this.contracts.IdeaFund.cleanUpDust(amount, token, sendto);
  }

  async ideaFundBuyingTokenAwithTokenB(tokenA: String, tokenB: String, numTokens: BigNumber): Promise<TransactionResponse> {
    return await this.contracts.IdeaFund.ideaFundBuyingTokenAwithTokenB(tokenA, tokenB, numTokens);
  }

  async investInHedgeFund(token: String, amount: BigNumber): Promise<TransactionResponse> {
    return await this.contracts.IdeaFund.investInHedgeFund(token, amount);
  }

  async withdrawFromHedgeFund(amount: BigNumber): Promise<TransactionResponse> {
    return await this.contracts.IdeaFund.withdrawFromHedgeFund(amount);
  }

  async allocateSeigniorage(): Promise<TransactionResponse> {
    return await this.contracts.Treasury.allocateSeigniorage();
  }
}
