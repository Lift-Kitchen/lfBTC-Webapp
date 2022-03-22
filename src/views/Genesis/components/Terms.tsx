import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import useModal from '../../../hooks/useModal';
import UnlockWallet from './UnlockWallet';

interface termsProps extends ModalProps {
	acceptTerms?: string
}

const Terms: React.FC<termsProps> = ({ onDismiss, acceptTerms }) => {

	const accept: any = useModal(
		<UnlockWallet />,
	);

	return (
		<Modal
			variant={'modal'}>
			<ModalTitle text={`Terms and Conditions`} />
			<TermScroll>
				<p>USER AGREEMENT: By using this site and app, you acknowledge and agree to the terms and conditions at https://quantstamp.com/legal/terms, privacy terms at https://quantstamp.com/legal/privacy, and the cautionary statements and disclaimers throughout this site, which are all hereby incorporated by reference into this agreement. In particular, you warrant and represent that you and your wallet address are not named on any government list of persons or entities whose assets are blocked or who are prohibited from receiving exports, e.g., the U.S. Department of the Treasury Office of Foreign Asset Control’s Specially Designated Nationals And Blocked Persons List, as updated from time to time, and you shall not use this site or app in violation of any laws of any applicable jurisdiction(s), including but not limited to any export, embargo, anti-terrorist financing/anti-money laundering prohibition, global standards endorsed by the Financial Action Task Force, or other restriction. If you do not agree, discontinue use immediately.</p>
				<p>IMPORTANT CAUTION: By using this site and app, you acknowledge and agree that your interactions with this site and the app are NOT private. This site and app enable connectivity to the Ethereum platform, a public blockchain-based distributed computing platform and operating system and thus your interactions, information submitted, and resulting scan reports are publicly accessible as further described herein. Additionally, this site and app enable screen capture and recording of your interactions, inputs, and data. In particular, any source code that you submit to be scanned will be publicly accessible, storable, and stored by one or more entities throughout multiple jurisdictions. If you do not want your information to be publicly accessible, captured, processed, and/or recorded, you must discontinue use immediately.</p>
				<p>DISCLAIMER: The Quantstamp smart contract security scanning product is subject to dependencies and under continuing development. You agree that your access and/or use, including but not limited to any associated services, products, protocols, platforms, content, and materials, will be at your sole risk on an as-is, where-is, and as-available basis. Cryptographic tokens are emergent technologies and carry with them high levels of technical risk and uncertainty. Scan reports could include false positives, false negatives, and other unpredictable results. The product accesses, and depends upon, multiple layers of third-parties, including third-party node operators, MetaMask, Etherscan, Medium, Github, and other platforms. The Solidity language itself, its various versions, and other smart contract languages remain under development and are subject to unknown risks and flaws. The Ethereum platform is operated by others and may experience changes, forks, multiple versions, or interruptions that are not in our control. The scan of a smart contract does not extend to the compiler layer, or any other areas beyond the submitted Solidity code or other programming aspects that could present security risks. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with this product and your use thereof, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant, endorse, guarantee, or assume responsibility for any of the following: any product, service, content, application, or information referenced, advertised, or offered by a third party through the product; any open source or third party software, code, libraries, materials, or information linked to, called by, or accessible through the product; any hyperlinked website, or any website or mobile application featured in any banner or other advertising; and we will not be a party to or in any way be responsible for monitoring any transaction between you and any third-party providers of products or services. Third party names, logos, and content are property of their respective owners. As with the purchase or use of a product or service through any medium or in any environment, you should use your best judgement and exercise caution where appropriate. Refunds are not available. You may risk loss of QSP, Ether, tokens, or other loss. Features, functionality, schedules, or design architectures are subject to continuing update, modification, cancellation, delay, external dependencies, evolving regulatory frameworks, and/or factors beyond our control and you are cautioned not to place undue reliance on this information. FOR AVOIDANCE OF DOUBT, THE SITE, APP, PRODUCT, AND ACCESS AND/OR USAGE THEREOF, INCLUDING ANY ASSOCIATED SERVICES OR MATERIALS, SHALL NOT BE CONSIDERED OR RELIED UPON AS ANY MANNER OR FORM OF INVESTMENT, INVESTMENT PURPOSE, VEHICLE WITH AN EXPECTATION TO EARN A PROFIT, OR FINANCIAL, INVESTMENT, TAX, LEGAL, REGULATORY, OR OTHER ADVICE.</p>
			</TermScroll>
			<ModalActions>
				<Button text="Cancel" variant="secondary" onClick={onDismiss} />
	          	<Button text="Accept" variant="ghost" onClick={accept} />
	        </ModalActions>
	    </Modal>
	)
}

export default Terms

const TermScroll = styled.div`
	max-height: 200px;
	overflow: auto;
`