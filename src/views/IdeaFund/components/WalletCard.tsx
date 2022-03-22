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
import { WalletInfo } from '../../../lift/types'
import ERC20 from '../../../lift/ERC20';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useCatchError from '../../../hooks/useCatchError';
import { getDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface WalletInfoProps {
  walletInfo: WalletInfo;
}

const WalletCard: React.FC<WalletInfoProps> = ({
  walletInfo
}) => {
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardTitle>{walletInfo?.walletName}</StyledCardTitle>
          <StyledExchanger>
            <StyledToken>
              <Label text="wBTC Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.wbtcSupply, 8)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledExchanger>
            <StyledToken>
              <Label text="lfBTC Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.lfbtcSupply, 18)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledExchanger>
            <StyledToken>
              <Label text="ETH Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.wethSupply, 18)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledExchanger>
            <StyledToken>
              <Label text="lfETH Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.lfethSupply, 18)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledExchanger>
            <StyledToken>
              <Label text="LIFT Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.liftSupply, 18)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledExchanger>
            <StyledToken>
              <Label text="CTRL Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.ctrlSupply, 18)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledExchanger>
            <StyledToken>
              <Label text="wBTC/lfBTC Pair Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.pegPairSupply, 18, 6)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledExchanger>
            <StyledToken>
              <Label text="wETH/lfETH Pair Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.pegEthPairSupply, 18, 6)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledExchanger>
            <StyledToken>
              <Label text="lfBTC/LIFT Pair Supply" variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <Label text={getDisplayBalance(walletInfo?.sharePairSupply, 18)} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          {walletInfo?.walletName == "IdeaFund Contract Wallet" ? (
          <StyledExchanger>
          <StyledToken>
            <Label text="HAIF Supply" variant="normal" />
          </StyledToken>
          <StyledExchangeArrow>
            <FontAwesomeIcon icon={faArrowRight} />
          </StyledExchangeArrow>
          <StyledToken>
            <Label text={getDisplayBalance(walletInfo?.haifSupply, 18)} variant="normal" />
          </StyledToken>
        </StyledExchanger>
          ) : (
            <></>
          )}
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

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
