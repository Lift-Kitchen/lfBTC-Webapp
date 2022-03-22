import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import useLiftKitchen from '../../../hooks/useLiftKitchen';
import Label from '../../../components/Label';
import TokenSymbol from '../../../components/TokenSymbol';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useModal from '../../../hooks/useModal';
import ExchangeModal from './ExchangeModal';
import { WalletStats, WalletStatsAttributes } from '../../../lift/types'
import ERC20 from '../../../lift/ERC20';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useCatchError from '../../../hooks/useCatchError';
import { getDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface WalletInfoProps {
  walletInfo: WalletStatsAttributes;
}

const WalletCard: React.FC<WalletInfoProps> = ({
  walletInfo
}) => {

  //console.log(walletInfo?.liftSupply.toString());

  return (
    <Div>
      {walletInfo?.walletAddress} | LFBTC Supply: {getDisplayBalance(walletInfo?.lfbtcSupply, 18)} | LFETH Supply: {getDisplayBalance(walletInfo?.lfethSupply, 18)} | LIFT Earned: {getDisplayBalance(walletInfo?.liftSupply, 18)} | LIFT Genesis: {getDisplayBalance(walletInfo?.liftSupplyGenesis, 18)} | CTRL Supply: {getDisplayBalance(walletInfo?.ctrlSupply, 18)}
    </Div>
  );
};

const Div = styled.div``;

const StyledCardTitle = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[300]};
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 80px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledExchangeArrow = styled.div`
  font-size: 20px;
  color: ${(props) => props.theme.color.grey[300]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default WalletCard;
