import React from 'react'
import styled from 'styled-components'

import Nav from './components/Nav'

const Footer: React.FC = () => (
  <div>
    <StyledFooter>
      <StyledFooterInner>
        <Nav />
      </StyledFooterInner>
    </StyledFooter>
    <div className="footer">
      <div>By using this website application you agree to and understand the following:</div><br/><br/>
      <div> <b>Risk of Loss Disclaimer</b><br/>
      This website and any videos, articles, or publications contained herein are provided by LK Tech Club Incubator LLC d/b/a Lift.Kitchen  (“Lift.Kitchen”) for informational purposes only. Participating involves the risk of loss and participants should be prepared to bear potential losses. Past performance may not be indicative of future results and may have been impacted by events and economic conditions that will not prevail in the future. No portion of this website and/or linked materials are to be construed as a solicitation to buy or sell a security or the provision of personalized investment advice. Certain information contained in this website is derived from sources that Lift.Kitchen believes to be reliable; however, Lift.Kitchen does not guarantee the accuracy or timeliness of such information and assumes no liability for any resulting damages.</div><br/>
      <div><b>Self-Acknowledged Certified Status</b><br/>
     You hereby certify that you are participating from outside of the United States, or that you meet the Accredited Investor criteria as defined by Regulation D of the Securities Act of 1933. If you plan to invest as a United Stated based Accredited Investor, you recognize and certify that you will contact Lift.Kitchen and provide documentation required to qualify and document you as an Accredited Investor. You agree that your selection is true and correct to the best of your knowledge. You understand that a false statement may disqualify you for continued participation in the DAO. </div><br/><br/>
      <div><b>Agree to Hold Harmless</b><br/>
      I hereby agree to indemnify and hold harmless Lift.Kitchen, and its directors, subsidiaries, employees, and affiliates, from and against any and all claims, demands, or causes of action of any kind or nature resulting from or in connection with the use of this website or application, and from and against any resulting losses, costs, expenses, reasonable attorney’s fees, liabilities, damages, orders, judgments, or decrees in connection herewith.</div><br/><br/>
      <b>Full Compliance with Terms of Service and Acknowledgement of Privacy Policy</b>
      <div>You agree to be fully compliant with all terms and conditions in the <a className="footerlink" target="_blank" href="https://lift.kitchen/terms-of-service/">Terms of Service</a>.</div>
      <div>You fully understand and acknowledge the <a className="footerlink" target="_blank" href="https://lift.kitchen/privacy-policy/">Privacy Policy</a>.</div>
    </div>
  </div>
)

const StyledFooter = styled.footer`
  align-items: center;
  background-color: ${(props) => props.theme.color.grey[800]};
  display: flex;
  justify-content: center;
`
const StyledFooterInner = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: ${props => props.theme.topBarSize}px;
  max-width: ${props => props.theme.siteWidth}px;
  width: 100%;
`

export default Footer
