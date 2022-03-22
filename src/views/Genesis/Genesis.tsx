import { useWallet } from 'use-wallet';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import Label from '../../components/Label';
import Page from '../../components/Page';
import Unlock from './components/Unlock';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { GenesisStats } from '../../lift/types';
import useLiftKitchen from '../../hooks/useLiftKitchen';

import hero from '../../assets/img/hero-cropped-alt.jpg';
import chris from '../../assets/img/chris_spears.jpg';
import mike from '../../assets/img/mike-winburn.jpg';
import alex from '../../assets/img/alex-avendano.jpg';
import UnlockWallet from './components/UnlockWallet';

const Genesis: React.FC = () => {
	const liftKitchen = useLiftKitchen();
		
	const [genesis, setStat] = useState < GenesisStats > ();

	const fetchStats = useCallback(async () => {
		setStat(await liftKitchen.getGenesisStat());
	}, [liftKitchen]);


	useEffect(() => {
		if (liftKitchen) {
			fetchStats().catch((err) => console.error(err.stack));
		}
	}, [liftKitchen]);

	return (
		<Page>
<PageHeaderWrapper>
	<PageHeader
		subtitle="A new type of venture incubator backed by the crypto and traditional community and distributed as a Decentralized Autonomous Organization (DAO), producing products based on blockchain technology that improve the human experience and engage the crypto community."
		title="Welcome to the Lift.Kitchen DAO!"
	/>
</PageHeaderWrapper>

<StyledOverview>        
	<FlexWrapper>
		<Wrapper2Third>
			<CardHeader>Lift.Kitchen Genesis Exchange</CardHeader>
			<br/><GuideText><b>ATTENTION:</b> This is an exchange, after exchanging tokens you can not recover them from the contract.</GuideText>

			<br/><GuideText><a href="https://lift-kitchen.medium.com/lift-kitchen-the-overview-5ba6c47ddc77" target="_blank">Read our Medium Article!</a></GuideText>
			<br/><CardHeader>About Lift.Kitchen</CardHeader>
			<br/><GuideText>Lift.Kitchen is a community of crypto and blockchain enthusiasts and professionals working together to conceive of, build, and launch innovative new blockchain products and services. Operating as a fully transparent DAO, our incubator-like model encourages community participation to support it’s own growth. Join us today. </GuideText>
			<br/><GuideText><a href="https://lift.kitchen/about/" target="_blank">Learn more About Lift.Kitchen</a>.</GuideText>
			<br/><br/>
		</Wrapper2Third>
		<WrapperThird>
			<ButtonWrapper>
				<Unlock /> 
				<UnlockWalletMobile />
			</ButtonWrapper>
		</WrapperThird>
	</FlexWrapper>

	<WrapperHalf>
		<StyledCards>
			<CardSection>
				<StyledValueSmall>{genesis?.wbtcSupply}</StyledValueSmall>
				<Label text="Total Staked wBTC" color="#e9b64c" />
			</CardSection>
		</StyledCards>
	</WrapperHalf>

	<WrapperHalf>
		<StyledCards>
			<CardSection>
				<StyledValueSmall>{genesis?.totalStakedValue}</StyledValueSmall>
				<Label text="Total Staked Value" color="#e9b64c" />
			</CardSection>
		</StyledCards>
	</WrapperHalf>

	<WrapperHalf>
		<StyledCards>
			<CardSection>
				<StyledValueSmall>2 - 5x based on lockup</StyledValueSmall>
				<Label text="Current Multiplier" color="#e9b64c" />
			</CardSection>
		</StyledCards>
	</WrapperHalf>

	<WrapperHalf>
		<StyledCards>
			<CardSection>
				<StyledValueSmall>{genesis?.totalmultipliedwbtc}</StyledValueSmall>
				<Label text="Total Multiplied wBTC" color="#e9b64c" />
			</CardSection>
		</StyledCards>
	</WrapperHalf>

	<WrapperHalf>
		<StyledCardsIFBTC>
			<CardSection>
				<StyledValueIFBTC>{genesis?.stakingTokenPrice}</StyledValueIFBTC>
				<Label text="lfBTC Price at Launch" color="#e9b64c" />
			</CardSection>
		</StyledCardsIFBTC>
	</WrapperHalf>

	<WrapperHalf>
		<StyledCardsIFBTC>
			<CardSection>
				<StyledValueIFBTC>{genesis?.stakepegPool}</StyledValueIFBTC>
				<Label text="Size of wBTC-lfBTC Liquidity Pool" color="#e9b64c" />
			</CardSection>
		</StyledCardsIFBTC>
	</WrapperHalf>

	<WrapperHalf>
		<StyledCardsLift>
			<CardSection>
				<StyledValueLift>{genesis?.shareTokenPrice}</StyledValueLift>
				<Label text="LIFT Price at Launch" color="#e9b64c" />
			</CardSection>
		</StyledCardsLift>
	</WrapperHalf>

	<WrapperHalf>
		<StyledCardsLift>
			<CardSection>
				<StyledValueLift>{genesis?.pegsharePool}</StyledValueLift>
				<Label text="Size of lfBTC-LIFT Liquidity Pool" color="#e9b64c" />
			</CardSection>
		</StyledCardsLift>
	</WrapperHalf>
</StyledOverview>

<TeamSection>
	<TeamHeader>Operating Executives</TeamHeader>
	<TeamMembers>
		<Member>
			<MemberImage>
				<img src={chris} />
			</MemberImage>
			<MemberName>Chris<span>Spears</span></MemberName>
			<MemberInfo>Focused on innovation, concept development, fundraising, technology and consumer strategy, and overall senior leadership.</MemberInfo>
		</Member>
		<Member>
			<MemberImage>
				<img src={mike} />
			</MemberImage>
			<MemberName>Mike<span>Winburn</span></MemberName>
			<MemberInfo>Focused on technology standards and implementations, tech team building, security, and all things tech.</MemberInfo>
		</Member>
		<Member>
			<MemberImage>
				<img src={alex} />
			</MemberImage>
			<MemberName>Alex<span>Avendano</span></MemberName>
			<MemberInfo>Focused on team building, operational management, financial strategies, and growth strategies.</MemberInfo>
		</Member>
	</TeamMembers>
</TeamSection>
</Page>
	);
};

const PageHeaderWrapper = styled.div `
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

const FlexWrapper = styled.div `
	display: flex;
	flex-wrap: wrap;
	margin: 0 auto;
	max-width: 1200px;
`

const UnlockWalletMobile = () => {
	const { connect, status } = useWallet();
	return (
		<Center>
			<Button onClick={() => connect('injected')} text={status} variant="ghost"/>
		</Center>
	);
};

const Center = styled.div `
	display: flex;
	flex: 1;
	margin: 100px, 100px, 100px, 100px;
	align-items: center;
	justify-content: center;
	display:none;
	@media only screen and (max-width: 767px) {
		  display:block;
	}
`;


 

const StyledCardWrapper = styled.div `
	display: flex;
	flex: 1;
	flex-direction: column;
	@media (max-width: 768px) {
	width: 80%;
}
`;

const StyledOverview = styled.div `
	box-sizing: border-box;
	display: flex;
	clear: both;
	flex-wrap: wrap;
	justify-content: space-between;
	max-width: 1200px;
	padding: 20px;
	width: 100%;
`;

const WrapperFull = styled.div `
	border-bottom: 1px solid ${props => props.theme.color.grey[200]};
	box-sizing: border-box;
	vertical-align: center;
	margin: 0 auto 40px;
	padding: 20px;
	width: 100%;
	@media (max-width: 384px) {
		margin-top: ${(props) => props.theme.spacing[4]}px;
	}
`;

const WrapperHalf = styled.div `
	box-sizing: border-box;
	vertical-align: center;
	padding: 20px;
	width: 50%;
	@media (max-width: 767px) {
		width: 100%;
	}
	@media (max-width: 384px) {
		margin-top: ${(props) => props.theme.spacing[4]}px;
	}
`;

const WrapperThird = styled.div `
	box-sizing: border-box;
	vertical-align: center;
	padding: 20px;
	width: 33.333%;
	@media (max-width: 767px) {
		width: 100%;
	}
	@media (max-width: 384px) {
		margin-top: ${(props) => props.theme.spacing[4]}px;
	}
`;

const Wrapper2Third = styled.div `
	box-sizing: border-box;
	vertical-align: center;
	padding: 20px;
	width: 66.667%;
	@media (max-width: 767px) {
		width: 100%;
	}
	@media (max-width: 384px) {
		margin-top: ${(props) => props.theme.spacing[4]}px;
	}
`;

const WrapperQuarter = styled.div `
	box-sizing: border-box;
	vertical-align: ce
	nter;
	padding: 20px;
	width: 25%;
	@media (max-width: 767px) {
		width: 100%;
	}
	@media (max-width: 384px) {
		margin-top: ${(props) => props.theme.spacing[4]}px;
	}
`;

const CardHeader = styled.h2 `
	color: ${props => props.theme.color.orange[100]};
	font-size: 42px;
	font-weight: 400;
	margin: 20px 0;
`;

const StyledCards = styled.div `
	min-width: 200px;
	padding: ${(props) => props.theme.spacing[3]}px;
	padding-top: 40px;
	color: ${(props) => props.theme.color.grey[100]};
	background: ${(props) => props.theme.color.white[100]};  /* fallback for old browsers */
	background: -webkit-radial-gradient(top left, #ffffff 50%, #E9E4F0);  /* Chrome 10-25, Safari 5.1-6 */
	background: radial-gradient(top left, #ffffff 50%, #E9E4F0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	box-shadow: 0 0 12px rgba(0,0,0,0.05);
	box-sizing: border-box;
	border-top-right-radius: 12px;
	border-bottom-left-radius: 12px;
	position: relative;
	@media (max-width: 768px) {
		width: 100%;
	}

	&:after {
		background-color: ${props => props.theme.color.orange[100]};
		content: '';
		display: block;
		height: 5px;
		position: absolute;
		left: 0;
		top: 0;
		width: 100px;
	}
`;

const StyledCardsIFBTC = styled.div `
	min-width: 200px;
	padding: ${(props) => props.theme.spacing[3]}px;
	padding-top: 40px;
	color: ${(props) => props.theme.color.grey[100]};
	background: ${(props) => props.theme.color.white[100]};  /* fallback for old browsers */
	background: -webkit-radial-gradient(top left, #ffffff 50%, #E9E4F0);  /* Chrome 10-25, Safari 5.1-6 */
	background: radial-gradient(top left, #ffffff 50%, #E9E4F0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	box-shadow: 0 0 12px rgba(0,0,0,0.05);
	border-top-right-radius: 12px;
	border-bottom-left-radius: 12px;
	box-sizing: border-box;
	position: relative;
	@media (max-width: 768px) {
		width: 100%;
	}

	&:after {
		background-color: ${props => props.theme.color.blue[100]};
		content: '';
		display: block;
		height: 5px;
		position: absolute;
		left: 0;
		top: 0;
		width: 100px;
	}
`;

const StyledCardsLift = styled.div `
	background: ${(props) => props.theme.color.white[100]};  /* fallback for old browsers */
	background: -webkit-radial-gradient(top left, #ffffff 50%, #E9E4F0);  /* Chrome 10-25, Safari 5.1-6 */
	background: radial-gradient(top left, #ffffff 50%, #E9E4F0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	border-top-right-radius: 12px;
	border-bottom-left-radius: 12px;
	box-shadow: 0 0 12px rgba(0,0,0,0.05);
	box-sizing: border-box;
	color: ${(props) => props.theme.color.grey[100]};
	min-width: 200px;
	padding: ${(props) => props.theme.spacing[3]}px;
	padding-top: 40px;
	position: relative;
	@media (max-width: 768px) {
		width: 100%;
	}

	&:after {
		background-color: ${props => props.theme.color.grey[600]};
		content: '';
		display: block;
		height: 5px;
		position: absolute;
		left: 0;
		top: 0;
		width: 100px;
	}
`;

const StyledValue = styled.span `
	display: inline-block;
	font-size: 72px;
	color: ${(props) => props.theme.color.orange[100]};
`;

const StyledValueIFBTC = styled.span `
	display: inline-block;
	font-size: 36px;
	color: ${(props) => props.theme.color.blue[200]};
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const StyledValueLift = styled.span `
	display: inline-block;
	font-size: 36px;
	color: ${(props) => props.theme.color.grey[600]};
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const StyledValueSmall = styled.span `
	display: inline-block;
	font-size: 36px;
	color: ${(props) => props.theme.color.orange[100]};
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const CardSection = styled.div `
	margin-bottom: ${(props) => props.theme.spacing[4]}px;

	&:last-child {
		margin-bottom: 0;
	}
`;

const ValueSkeletonPadding = styled.div `
	padding-top: ${(props) => props.theme.spacing[3]}px;
	padding-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledSupplyLabel = styled.a `
	display: block;
	color: ${(props) => props.color};
`;

const ValueSkeleton = () => {
	const theme = useContext(ThemeContext);
	return (
		<SkeletonTheme color={theme.color.grey[700]} highlightColor={theme.color.grey[600]}>
			<ValueSkeletonPadding>
				<Skeleton height={10} />
			</ValueSkeletonPadding>
		</SkeletonTheme>
	);
};



const GuideText = styled.div `
	color: ${(props) => props.theme.color.primary.main};
	font-size: 1.25rem;
`;

const ValueText = styled.p `
	color: ${(props) => props.theme.color.white};
	font-weight: bold;
	font-size: 1.25rem;
	margin: ${(props) => props.theme.spacing[1]}px 0;
`;

const ButtonWrapper = styled.div `
	margin: 40px auto;
	max-width: 200px;
`;

const TeamSection = styled.div `
	background-color: ${(props) => props.theme.color.orange[100]};
	box-sizing: border-box;
	padding: 60px 0;
	margin-top: 60px;
	width: 100%;
`;

const TeamHeader = styled.h2 `
	color: ${props => props.theme.color.white[100]};
	font-size: 36px;
	font-weight: 400;
	margin: 20px 0;
	text-align: center;
`;

const TeamMembers = styled.div `
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin: 0 auto;
	max-width: 1200px;
	padding: 40px;
`

const Member = styled.div `
	background-color: ${(props) => props.theme.color.white[100]};
	border-bottom-left-radius: 12px;
	border-top-right-radius: 12px;
	border-top-left-radius: 70px;
	box-sizing: border-box;
	box-shadow: 0 6px 12px -6px rgba(0,0,0,0.2);
	display: flex;
	flex-wrap: wrap;
	flex: 0 0 31.333%;
	margin: 0 1%;
	max-width: 320px;
	padding: 20px;

	@media(max-width:767px){
		flex-basis: 100%;
	}
`

const MemberImage = styled.div `
	border-radius: 50%;
	height: 100px;
	width: 100px;
	overflow: hidden;

	img {
		max-width: 100%;
	}
`

const MemberName = styled.h4 `
	align-self: flex-end;
	margin: 0;
	font-size: 36px;
	span {
		font-weight: 100;
	}
`

const MemberInfo = styled.p `
	flex: 0 0 100%;
	font-size: 1rem;
`

export default Genesis;
