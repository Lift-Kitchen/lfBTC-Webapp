import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import TokenSymbol from '../../../components/TokenSymbol';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import { getDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';

const Harvest: React.FC = ({}) => {
  const { onReward } = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();  

  const availEarnings = (!!earnings) ? getDisplayBalance(BigNumber.from(earnings.controlValue).add(BigNumber.from(earnings.shareValue)), 18, 10) : "0";
  
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="CTRL" title=""/>
            </CardIcon>
            {!!earnings ? (<Value value={availEarnings} />) : (<></>)}
            <Label text="CTRL Earned" />
          </StyledCardHeader>
          <StyledCardActions>
          <Button onClick={onReward} text="Claim Reward" disabled={Number(availEarnings) == 0} />
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

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

const StyledSpacer = styled.div`
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

export default Harvest;
