import React from 'react';
import styled from 'styled-components';

import lfBTCLogo from '../../assets/img/lfBTC-logo.png';
import lfETHLogo from '../../assets/img/lfETH-logo.png';
import alUSDLogo from '../../assets/img/alUSD-logo.png';
import iFARMLogo from '../../assets/img/iFARM-logo.png';
import PICKLELogo from '../../assets/img/PICKLE-logo.png';
import BASv2Logo from '../../assets/img/BASv2-logo.png';
import KBTCLogo from '../../assets/img/KBTC-logo.png';
import LIFTLogo from '../../assets/img/LIFT-logo.png';
import CTRLLogo from '../../assets/img/CTRL-logo.png';
import wBTCLogo from '../../assets/img/wbtc-logo.png';
import wETHlfETHLogo from '../../assets/img/lfETH-logo.png';
import wBTClfBTCLogo from '../../assets/img/lfBTC-logo.png';
import lfBTCLIFTLogo from '../../assets/img/LIFT-logo.png';

const logosBySymbol: {[title: string]: string} = {
  'LFBTC': lfBTCLogo,
  'LFETH': lfETHLogo,
  'CTRL': CTRLLogo,
  'LIFT': LIFTLogo,
  'wBTC': wBTCLogo,
  'alUSD': alUSDLogo,
  'iFARM': iFARMLogo,
  'KBTC': KBTCLogo,
  'PICKLE': PICKLELogo,
  'BASv2': BASv2Logo,
  'wETH-lfETH': wETHlfETHLogo,
  'wBTC-lfBTC': wBTClfBTCLogo,
  'lfBTC-LIFT': lfBTCLIFTLogo,
};

type LiftLogoProps = {
  symbol: string;
  title?: string;
  size?: number;
}

const LogoWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LogoTitle = styled.div`
  padding-left: 15px;
  font-size: 24px;
  font-weight: 700;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  color: #eeeeee;
`;

const TokenSymbol: React.FC<LiftLogoProps> = ({ symbol, title = "", size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid LiftLogo symbol: ${symbol}`);
  }
  return (
    <LogoWrapper>
      <img
        src={logosBySymbol[symbol]}
        alt={`${symbol} Logo`}
        width={size}
        height={size}
      /><LogoTitle>{title}</LogoTitle>
    </LogoWrapper>
  )
};

export default TokenSymbol;
