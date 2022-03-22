import React, { useCallback, useMemo, useState } from 'react'
import { useWallet } from 'use-wallet';
import styled, { ThemeContext } from 'styled-components';

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import DepositModal from './DepositModal';

import useLiftKitchen from '../../../hooks/useLiftKitchen';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useStakeToGenesis from '../../../hooks/useStakeToGenesis';
import { defaultEthereumConfig } from '../../../lift/config';


interface UnlockWalletProps extends ModalProps {
	tokenName?: string,
}

const UnlockWallet: React.FC<UnlockWalletProps> = ({ onDismiss, tokenName = '' }) => {
	//const [val, setVal] = useState('');
	//const [isStaked, setIsStaked] = useState(false);	
	const { onStake } = useStakeToGenesis();
	const { account } = useWallet();
	
	const liftKitchen = useLiftKitchen();
	const [approved, setApproval] = useState(Boolean);
    const [signed, setSigned] = useState(Boolean);
	const [curClass, setCurClass] = useState('');

	const [approveStatus, approve] = useApprove(
		liftKitchen.externalTokens['wBTC'],
		liftKitchen.genesisVault().address,
	);

	const tokenBalance = useTokenBalance(liftKitchen.externalTokens["wBTC"]);
  	//const stakedBalance = useGenesisBalance();

	//const fullBalance = useMemo(() => {
	//	return getFullDisplayBalance(tokenBalance, tokenName === 'USDC' ? 6 : 18)
	//}, [tokenBalance])

	const onConfirm: any = (value: string, term: number) => {
		setCurClass('loading');
        onStake(value, term);
        //setIsStaked(true);
        onDismiss();
        setCurClass('active');
    }

	//const [stakeBal, setStakeBal] = useState(stakedBalance);
	//const[displayBal, setDisplayBal] = useState('');

    //const [tokens, setTokens] = useState(fullBalance);
	//console.log("counting up", curClass, approveStatus);

	const onConfirmApp = async () => {
		approve();
		setApproval(true);
	}
	
	const terms = 'ATTENTION: This is an exchange, after exchanging tokens you cannot recover them from the contract. Now we have to get the legal statements out of the way: As a fully doxxed team, we have to make sure each of our participants read and understand the below. By using this website application you agree to and understand the following: Risk of Loss Disclaimer: This website and any videos, articles, or publications contained herein are provided by LK Tech Club Incubator LLC d/b/a Lift.Kitchen (“Lift.Kitchen”) for informational purposes only. Participating involves the risk of loss and participants should be prepared to bear potential losses. Past performance may not be indicative of future results and may have been impacted by events and economic conditions that will not prevail in the future. No portion of this website and/or linked materials are to be construed as a solicitation to buy or sell a security or the provision of personalized investment advice. Certain information contained in this website is derived from sources that Lift.Kitchen believes to be reliable; however, Lift.Kitchen does not guarantee the accuracy or timeliness of such information and assumes no liability for any resulting damages. Self-Acknowledged Participant Status: You hereby certify that you are participating from outside of the United States, or that you meet the Accredited Investor criteria as defined by Regulation D of the Securities Act of 1933. If you plan to invest as a United Stated based Accredited Investor, you recognize and certify that you will contact Lift.Kitchen and provide documentation required to qualify and document you as an Accredited Investor.  You agree that your selection is true and correct to the best of your knowledge. You understand that a false statement may disqualify you for continued participation in the DAO. Agree to Hold Harmless: You hereby agree to indemnify and hold harmless Lift.Kitchen, and its directors, subsidiaries, employees, and affiliates, from and against any and all claims, demands, or causes of action of any kind or nature resulting from or in connection with the use of this website or application, and from and against any resulting losses, cn\osts, expenses, reasonable attorney’s fees, liabilities, damages, orders, judgments, or decrees in connection herewith. Full Compliance with Terms of Service and Acknowledgement of Privacy Policy: You agree to be fully compliant with all terms and conditions in the Terms of Service. You fully understand and acknowledge the Privacy Policy. By using this website application you agree to and understand the following: Risk of Loss Disclaimer This website and any videos, articles, or publications contained herein are provided by LK Tech Club Incubator LLC d/b/a Lift.Kitchen  (“Lift.Kitchen”) for informational purposes only. Participating involves the risk of loss and participants should be prepared to bear potential losses. Past performance may not be indicative of future results and may have been impacted by events and economic conditions that will not prevail in the future. No portion of this website and/or linked materials are to be construed as a solicitation to buy or sell a security or the provision of personalized investment advice. Certain information contained in this website is derived from sources that Lift.Kitchen believes to be reliable; however, Lift.Kitchen does not guarantee the accuracy or timeliness of such information and assumes no liability for any resulting damages. Self-Acknowledged Certified Status I hereby certify that my investor status selection is true and correct to the best of my knowledge. I understand that a false statement may disqualify me for continued participation in the DAO. Agree to Hold Harmless I hereby agree to indemnify and hold harmless Lift.Kitchen, and its directors, subsidiaries, employees, and affiliates, from and against any and all claims, demands, or causes of action of any kind or nature resulting from or in connection with the use of this website or application, and from and against any resulting losses, costs, expenses, reasonable attorney’s fees, liabilities, damages, orders, judgments, or decrees in connection herewith. Full Compliance with Terms of Service and Acknowledgement of Privacy Policy You agree to be fully compliant with all terms and conditions in the https://lift.kitchen/terms-of-service/ You fully understand and acknowledge the https://lift.kitchen/privacy-policy/';

    const walletUnlock = async () => {
		const ethUtil = require('ethereumjs-util');
		const Web3 = require('web3');
		const sigUtil = require('eth-sig-util');

		setCurClass('loading');
		let text = terms
		let msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
		// var msg = '0x1' // hexEncode(text)

		let web3 = new Web3(Web3.givenProvider)
		
		web3.eth.getAccounts().then((results: any) => {

			

			console.log('Getting accounts!', results)
			let from = results[0];

			var params = [msg, from]
			var method = 'personal_sign'

			if (typeof window !== "undefined")
			{
				(window as any).ethereum.sendAsync({
					method,
					params,
					from,
				}, function (err: any, result: any) {

					if (err) {
						setCurClass('active');
						return console.error(err)
					}
					if (result.error) {
						setCurClass('active');
						return console.error(result.error)
					}

					const msgParams = { data: msg, sig: '' }
					msgParams.sig = result.result
					const recovered = sigUtil.recoverPersonalSignature(msgParams)

					if (web3.utils.toChecksumAddress(recovered) === web3.utils.toChecksumAddress(from) ) {
						console.log("successfully signed");
						setSigned(true);
					} else {
						console.log('SigUtil Failed to verify signer when comparing ' + recovered + ' to ' + from);
						setSigned(false);
					}

					setCurClass('inactive');
				})
			}
		});
    }

	return (
		<div className={curClass}>
			{!!account && signed ?  (
				<>
					{approved || approveStatus === ApprovalState.APPROVED ? (	
						<div onLoad={() => setCurClass('active')} >
						<DepositModal variant={'modal'}
							max={tokenBalance}
							onConfirm={(value, term) => {
								setCurClass('loading');
								onStake(value,term);
								setCurClass('inactive');
								onDismiss();
							}}
      						tokenName={'wBTC'}
							onDismiss={() => {onDismiss();}}
  						/>
						</div>
					) : (
						<Modal variant={'modal'}>
							<ModalTitle text={`Approve ${tokenName}`} />
							<ModalActions>
							<Button text="Cancel" variant="secondary" onClick={onDismiss} />
							<Button
								disabled={approveStatus !== ApprovalState.NOT_APPROVED}
								onClick={onConfirmApp}
								text="Approve&nbsp;wBTC&nbsp;Staking"
								variant="ghost"
							/>
							</ModalActions>
					 	</Modal>						
					)}
				</>	
			) : (
				<div className={modalcss}>
				<Modal variant={'modal'} >
					<ModalTitle text={`Accept Terms of Service and Disclaimers`} />					
					<TermScroll>
						<b>ATTENTION: This is an exchange, after exchanging tokens you cannot recover them from the contract.</b><br/><br/>
						As a fully doxxed team, we have to make sure each of our participants read and understand the below. By using this website application you agree to and understand the following:<br/><br/>
						<b>Risk of Loss Disclaimer:</b> This website and any videos, articles, or publications contained herein are provided by LK Tech Club Incubator LLC d/b/a Lift.Kitchen (“Lift.Kitchen”) for informational purposes only. Participating involves the risk of loss and participants should be prepared to bear potential losses. Past performance may not be indicative of future results and may have been impacted by events and economic conditions that will not prevail in the future. No portion of this website and/or linked materials are to be construed as a solicitation to buy or sell a security or the provision of personalized investment advice. Certain information contained in this website is derived from sources that Lift.Kitchen believes to be reliable; however, Lift.Kitchen does not guarantee the accuracy or timeliness of such information and assumes no liability for any resulting damages. <br/><br/>
						<b>Self-Acknowledged Participant Status:</b> You hereby certify that you are participating from outside of the United States, or that you meet the Accredited Investor criteria as defined by Regulation D of the Securities Act of 1933. If you plan to invest as a United Stated based Accredited Investor, you recognize and certify that you will contact Lift.Kitchen and provide documentation required to qualify and document you as an Accredited Investor.  You agree that your selection is true and correct to the best of your knowledge. You understand that a false statement may disqualify you for continued participation in the DAO. <br/><br/>
						<b>Agree to Hold Harmless:</b> You hereby agree to indemnify and hold harmless Lift.Kitchen, and its directors, subsidiaries, employees, and affiliates, from and against any and all claims, demands, or causes of action of any kind or nature resulting from or in connection with the use of this website or application, and from and against any resulting losses, costs, expenses, reasonable attorney’s fees, liabilities, damages, orders, judgments, or decrees in connection herewith.<br/><br/>
							<b>Full Compliance with Terms of Service and Acknowledgement of Privacy Policy:</b><br/>
							You agree to be fully compliant with all terms and conditions in the <a href={"https://lift.kitchen/terms-of-service/"}>Terms of Service</a>.<br/>
							You fully understand and acknowledge <a href={"https://lift.kitchen/privacy-policy/"}>Privacy Policy</a>.<br/>
					</TermScroll>
					<ModalActions>
						<Button text="Cancel" variant="secondary" onClick={onDismiss} />
						<Button onClick={walletUnlock} text="Sign Attestation" variant="ghost" />
					</ModalActions>
				</Modal>
				</div>
			)}
		</div>
	)
}

export default UnlockWallet

const TermScroll = styled.div`
	max-height: 450px;
	overflow: auto;
`
const modalcss = `width : 65% !important`
