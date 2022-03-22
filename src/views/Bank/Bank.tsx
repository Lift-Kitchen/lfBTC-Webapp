import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import SecondaryNav from '../../components/SecondaryNav';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../lift';

import hero from '../../assets/img/banks-hero-cropped.jpg';

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));

  const { bankId } = useParams();
  const bank = useBank(bankId);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);

  return account && bank ? (
    <>
      <PageHeaderWrapper>
      <PageHeader
        subtitle="Please use the links above to join our Discord discussion and provide your opinion.  Use the liquiidty pools to buy/sell/stake at your own risk while this vote is going on."
        title="ALERT: We are having a vote to determine the future of the protocol!"
      />
      </PageHeaderWrapper>
      <SecondaryNav />
      <FlexWrapper>
        <StyledText>
          {bank.depositTokenName.includes('lfBTC') && <LPTokenHelpText bank={bank} />}
          {bank.depositTokenName.includes('lfETH') && <LPTokenHelpText bank={bank} />}
          </StyledText>
        <StyledBank>
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Harvest bank={bank} />
            </StyledCardWrapper>
            <Spacer />
            <StyledCardWrapper>
              <Stake bank={bank} />
            </StyledCardWrapper>
          </StyledCardsWrapper>
          {/* <Spacer size="lg" />
          <div>
            <Button onClick={onRedeem} text="Stake in Boardroom & Withdraw" variant="secondary" />
          </div> */}
          <Spacer size="lg" />
          <StyledText>{bank?.instructions}</StyledText>

        </StyledBank>
      </FlexWrapper>
    </>
  ) : !bank ? (
    <>
      <PageHeaderWrapper>
        <PageHeader
          subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
          title={bank?.name}
        />
      </PageHeaderWrapper>
      <SecondaryNav />
      <BankNotFound />
    </>
  ) : (
    <>
      <PageHeaderWrapper>
        <PageHeader
          subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
          title={bank?.name}
        />
      </PageHeaderWrapper>
      <SecondaryNav />
      <UnlockWallet />
    </>
  );
};

// const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
//   let pairName: string;
//   let token1Name: string;
//   let token2Name: string;
//   let token1Url: string;
//   let token2Url: string;
//   let uniswapUrl: string;
//   if (bank.depositTokenName.includes('wBTC')) {
//     pairName = 'wBTC-lfBTC pair';
//     token1Name = 'wBTC';
//     token2Name = 'lfBTC';
//     token1Url = 'https://app.sushi.com/swap?outputCurrency=0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
//     token2Url = 'https://app.sushi.com/swap?outputCurrency=0xafcE9B78D409bF74980CACF610AFB851BF02F257&inputCurrency=0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
//     uniswapUrl = 'https://app.sushi.com/add/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/0xafcE9B78D409bF74980CACF610AFB851BF02F257';
//   } else {
//     pairName = 'lfBTC-LIFT pair';
//     token1Name = 'lfBTC';
//     token2Name = 'LIFT';
//     token1Url = 'https://app.sushi.com/swap?outputCurrency=0xafcE9B78D409bF74980CACF610AFB851BF02F257&inputCurrency=0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
//     token2Url = 'https://app.sushi.com/swap?inputCurrency=0xafcE9B78D409bF74980CACF610AFB851BF02F257&outputCurrency=0xf9209d900f7ad1DC45376a2caA61c78f6dEA53B6';
//     uniswapUrl = 'https://app.sushi.com/add/0xafcE9B78D409bF74980CACF610AFB851BF02F257/0xf9209d900f7ad1DC45376a2caA61c78f6dEA53B6';
//   }
//   return (
//     <CenterColumn>
//       <StyledText>In order to add liquidity to the pools you must have equal amounts of both liquidity pool tokens.  You can scroll down below the boxes to see more detailed info.</StyledText>
//       <StyledLinkBreak href={token1Url} target="_blank">
//         {` Buy ${token1Name} on SushiSwap `}
//       </StyledLinkBreak>
//       <StyledLinkBreak href={token2Url} target="_blank">
//         {` Buy ${token2Name} on SushiSwap `}
//       </StyledLinkBreak>
//       <StyledLinkBreak href={uniswapUrl} target="_blank">
//         {` Provide liquidity ${pairName} `}
//       </StyledLinkBreak>
//     </CenterColumn>
//   );
// };

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  let pairName: string;
  let token1Url: string;
  let token2Url: string;
  if (bank.depositTokenName.includes('wBTC')) {
    pairName = 'wBTC-lfBTC pair';
    token1Url = 'https://zapper.fi/invest?protocol=sushiswap&contractAddress=0xd975b774c50aa0aeacb7b546b86218c1d7362123&modal=invest';
    token2Url = '';
  } else if (bank.depositTokenName.includes('lfETH')) {
    pairName = 'ETH-lfETH pair';
    //token1Url = 'https://app.sushi.com/swap?outputCurrency=0xe09b10efa59f6e17052e9a2d947bad6214e7cc90';
    //token2Url = 'https://app.sushi.com/add/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xE09B10EFA59F6E17052E9A2D947bAd6214E7CC90';
    token1Url = 'https://zapper.fi/invest?protocol=sushiswap&contractAddress=0xc92a6738d66ebffbacff9310255b949eb960c21a&modal=invest';
    token2Url = '';
  } else {
    pairName = 'lfBTC-LIFT pair';
    token1Url = 'https://zapper.fi/invest?protocol=sushiswap&contractAddress=0x0e250c3ff736491712c5b11ecee6d8dbfa41c78f&modal=invest';
    token2Url = '';
  }
  return (
    <CenterColumn>
      <StyledText>In order to add liquidity to the pools you must have equal amounts of both liquidity pool tokens.  We use Zapper.fi to make that easy for you check out the link below!</StyledText>
      <StyledLinkBreak href={token1Url} target="_blank">
        {` Provide liquidity ${pairName} `}
      </StyledLinkBreak>
      {token2Url.length > 0 && (
        <StyledLinkBreak href={token2Url} target="_blank">
          {` Provide liquidity`}
        </StyledLinkBreak>)}
    </CenterColumn>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader
        title="Not Found"
        subtitle="You've hit a bank just robbed by unicorns."
      />
    </Center>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledUniswapLPGuide = styled.div`
  margin: -24px auto 48px;
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledLinkBreak = styled(StyledLink)`
  background-color: ${(props) => props.theme.color.orange[100]};
  border-radius: 12px;
  color: ${(props) => props.theme.color.white[100]};
  display: flex;
  margin-bottom: 20px;
  padding: 10px 20px;
  text-align: center;

  &:hover {
    background-color: ${(props) => props.theme.color.orange[200]};
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const CenterColumn = styled(Center)`
  flex-direction: column;
`

const PageHeaderWrapper = styled.div`
  background-image: url(${hero});
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 80px 0 60px;
  width: 100%;
  @media (max-width: 1023px){
    background-image: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hero});
  }
  @media (max-width: 767px){
    background-position: 90% 50%;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
  padding: 40px;
`;

const StyledText = styled.div`
  margin-bottom: 40px;
  flex-basis: 100%;
`;

export default Bank;
