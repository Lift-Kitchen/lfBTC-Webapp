  async getTokenPriceFromUniswap(tokenContract: ERC20): Promise<string> {
    await this.provider.ready;

    const { chainId } = this.config;
    const { MockwBTC } = this.config.externalTokens;

    const mockwBTC = new Token(chainId, MockwBTC[0], 18);
    const token = new Token(chainId, tokenContract.address, 18);

    try {
      const mockwBTCToToken = await Fetcher.fetchPairData(mockwBTC, token, this.provider);
      const priceInwBTC = new Route([mockwBTCToToken], token);
      return priceInwBTC.midPrice.toSignificant(3);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

    /**
   * @returns Lift Kitchen stats from Uniswap.
   * It may differ from the lfBTC price used on Treasury (which is calculated in TWAP)
   */
  async getlfBTCStatFromUniswap(): Promise<TokenStat> {
    console.log("called")
    const supply = await this.LFBTC.displayedTotalSupply();
    console.log("supply",supply)

    const lfbtcPrice = Number(await this.getTokenPriceFromUniswap(this.lfBTC))
    console.log("lfbtcPrice",lfbtcPrice)

    const wbtcPrice = Number(await this.getwBTCPrice()) / 10**18
    console.log("wbtcPrice",wbtcPrice)


    return {
      priceInWBTC: String((lfbtcPrice / wbtcPrice).toFixed(3)),
      totalSupply: supply,
    };
  }

    /**
   * @returns Estimated Basis Gold (BSG) price data,
   * calculated by 1-day Time-Weight Averaged Price (TWAP).
   */
  async getGoldStatInEstimatedTWAP(): Promise<TokenStat> {
    const { Oracle } = this.contracts;

    const estimatedGoldPrice = await Oracle.price1Current();
    const realGoldPrice = await this.getRealGoldPrice()
    const totalSupply = await this.lfBTC.displayedTotalSupply();

    return {
      priceInWBTC: String((Number(estimatedGoldPrice) / Number(realGoldPrice)).toFixed(3)),
      totalSupply,
    };
  }

  async getGoldPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getGoldPrice();
  }

  async getRealGoldPrice(): Promise<BigNumber> {
    const { Oracle } = this.contracts;
    return Oracle.goldPriceOne();
  }

  
  // /**
  //  * Buy bonds with gold.
  //  * @param amount amount of gold to purchase bonds with.
  //  */
  // async buyBonds(amount: string | number, targetPrice: string | number): Promise<TransactionResponse> {
  //   const { Treasury } = this.contracts;
  //   return await Treasury.buyBonds(decimalToBalance(amount), targetPrice);
  // }

  // /**
  //  * Redeem bonds for gold.
  //  * @param amount amount of bonds to redeem.
  //  */
  // async redeemBonds(amount: string): Promise<TransactionResponse> {
  //   const { Treasury } = this.contracts;
  //   return await Treasury.redeemBonds(decimalToBalance(amount));
  // }