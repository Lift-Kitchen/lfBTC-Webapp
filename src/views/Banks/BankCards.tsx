import React from 'react';
import styled from 'styled-components';

import { Bank } from '../../lift';
import Button from '../../components/Button';
import Card from '../../components/Card';
import CardContent from '../../components/CardContent';
import CardIcon from '../../components/CardIcon';
import useBanks from '../../hooks/useBanks';
import TokenSymbol from '../../components/TokenSymbol';
import Notice from '../../components/Notice';


const BankCards: React.FC = () => {
  const [banks] = useBanks();

  const inactiveBanks = banks.filter((bank) => bank.finished);
  const activeBanks = banks.filter((bank) => !bank.finished);

  let finishedFirstRow = false;
  const inactiveRows = inactiveBanks.reduce<Bank[][]>(
    (bankRows, bank) => {
      const newBankRows = [...bankRows];
      if (bank.name.includes("IdeaFund")) {
        return newBankRows;
      } else if (newBankRows[newBankRows.length - 1].length === (finishedFirstRow ? 2 : 3)) {
        newBankRows.push([bank]);
        finishedFirstRow = true;
      } else {
        newBankRows[newBankRows.length - 1].push(bank);
      }
      return newBankRows;
    },
    [[]],
  );

  return (
       <StyledCards>
       {inactiveRows[0].length > 0 && (
         <StyledInactiveNoticeContainer>
           <Notice color="grey">
             <b>You have banks where the mining has finished.</b>
             <br />
             Please withdraw and settle your stakes.
           </Notice>
         </StyledInactiveNoticeContainer>
       )}
         <StyledRow>
         {activeBanks.map((bank, i) => (
           <React.Fragment key={bank.name}>
             <BankCard bank={bank} />
             {i < activeBanks.length - 1 && <StyledSpacer />}
           </React.Fragment>
         ))}
       </StyledRow>
       {inactiveRows[0].length > 0 && (
         <>
           <StyledInactiveBankTitle>Inactive Banks</StyledInactiveBankTitle>
           {inactiveRows.map((bankRow, i) => (
             <StyledRow key={i}>
               {bankRow.map((bank, j) => (
                 <React.Fragment key={j}>
                   {!bank.name.includes("IdeaFund") && (
                   <BankCard bank={bank} /> )}
                   {j < bankRow.length - 1 && <StyledSpacer />} 
                 </React.Fragment>
               ))}
             </StyledRow>
           ))}
         </>
       )}
     </StyledCards>
  );
};

interface BankCardProps {
  bank: Bank;
}

const BankCard: React.FC<BankCardProps> = ({ bank }) => {
  return (
    <StyledCardWrapper>
      {(bank.depositTokenName.includes('lfBTC') ? (
          <StyledCardSuperAccent />
        ) : (
          <StyledCardAccent />
        ))}
      <Card>
        <CardContent>
          <StyledContent>
            <CardIcon>
              <TokenSymbol symbol={bank.depositTokenName} title={bank.name} size={60} />
            </CardIcon>
            <StyledDetails>
              <StyledDetail>Pool APR: {bank.apy}%</StyledDetail>
              {!bank.poolTVL.includes("$0") ? ( <StyledDetail>Pool TVL: {bank.poolTVL}</StyledDetail> ) : ( <></>)}
              <StyledDetail>--------</StyledDetail>
              <StyledDetail>Deposit: {bank.depositTokenName.toUpperCase()}</StyledDetail>
              <StyledDetail>Earn: {`${bank.earnTokenName}`}</StyledDetail>
            </StyledDetails>
            <Button text="Select" to={`/bank/${bank.contract}`} variant="ghost" />
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  );
};

const StyledCardAccent = styled.div`
  border-radius: 12px;
  filter: blur(4px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const StyledCardSuperAccent = styled.div`
  border-radius: 12px;
  filter: blur(8px);
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  z-index: -1;
`;

const StyledCards = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0px 0 0px;
  width: 940px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  padding: 5px, 5px, 5px, 5px;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`;

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 24px;
  height: 70px;
  font-weight: 700;
  text-align: center;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDetails = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}px;
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`;

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[300]};
`;

const StyledInactiveNoticeContainer = styled.div`
  width: 598px;
  margin-bottom: ${(props) => props.theme.spacing[6]}px;
`;

const StyledInactiveBankTitle = styled.p`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.color.grey[400]};
  margin-top: ${(props) => props.theme.spacing[5]}px;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`;

export default BankCards;
