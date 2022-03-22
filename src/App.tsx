import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';

import BanksProvider from './contexts/Banks';
import LiftKitchenProvider from './contexts/LiftKitchenProvider';
import ModalsProvider from './contexts/Modals';

import Home from './views/Home';
import Banks from './views/Banks';
import Boardroom from './views/Boardroom';
import Genesis from './views/Genesis';
import Control from './views/Control';
import Genesis2 from './views/Genesis2';
import Redemption from './views/Redemption';
import IdeaFund from './views/IdeaFund';
import Zaps from './views/Zaps';
// import Data from './views/Data';

import store from './state';
import theme from './theme';
import config from './config';
import Updaters from './state/Updaters';

import Popups from './components/Popups';


const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Switch>
          <Route path="/genesis" >
            <Genesis />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/bank" >
            <Banks />
          </Route>
          <Route path="/boardroom" >
            <Boardroom />
          </Route>
          <Route path="/ideafund">
            <IdeaFund />
          </Route>
          <Route path ="/zaps" >
            <Zaps />
          </Route>
          <Route path ="/control" >
            <Control />
          </Route>
          <Route path ="/redemption/:addressId">
            <Redemption />
          </Route>
          {/* <Route path="/data">
            <Data />
          </Route> */}
        </Switch>
      </Router>
    </Providers>
  );
};

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider chainId={config.chainId}>
        <Provider store={store}>
          <Updaters />
          <LiftKitchenProvider>
            <ModalsProvider>
              <BanksProvider>
                <>
                  <Popups />
                  {children}
                </>
              </BanksProvider>
            </ModalsProvider>
          </LiftKitchenProvider>
        </Provider>
      </UseWalletProvider>
    </ThemeProvider>
  );
};

export default App;
