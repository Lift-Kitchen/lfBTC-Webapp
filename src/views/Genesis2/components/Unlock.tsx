import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import UnlockWallet from './UnlockWallet';
import useModal from '../../../hooks/useModal';
import { useWallet } from 'use-wallet';
import useGenesisBalance from '../../../hooks/useGenesisBalance';
import { getDisplayBalance } from '../../../utils/formatBalance';

const Unlock: React.FC = () => {
  const wallet = useWallet();

  const [join] = useModal(
    <UnlockWallet
      tokenName={'wBTC'}
    />,
  );

  const stakedBalance = useGenesisBalance();  
  const displayBalance = getDisplayBalance(stakedBalance, 8);
  let currentTimestamp = Date.now();

  //1619283600000
  //1619224786000

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="wBTC" />
            </CardIcon>
            <Value value={displayBalance} />
            <Label text="wBTC Staked" />
          </StyledCardHeader>
          <StyledCardActions>
            {currentTimestamp > 1619461800000 ? ( <Button onClick={() => { if (wallet.status === 'disconnected') {wallet.connect('injected');} join();}} text="Join the Revolution" variant="ghost" /> ) : ( <><Button text='Offline for just a few minutes.' disabled variant="ghost" /></>) }
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

// const UnlockWallet = () => {
//   const { connect } = useWallet();
//   return (
//     <Button onClick={() => connect('injected')} text="Add Stake" />
//   );
// };

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Unlock;
