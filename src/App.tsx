import './styles/App.global.scss';

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import centerContainer from './components/frontpage/CenterContainer';
import VerificationContainer from './components/verification/VerificationContainer';
import { useEffect } from 'react';
import { CortexDriver } from './modules/CortexDriver';
import AddIpPage from './components/addIpPage/AddIpPage';
import SelectProfilePage from './components/selectProfile/SelectProfilePage';
import StreamPage from './components/streamPage/StreamPage';
import StartPage from './components/StartPage/StartPage';

export default function App() {
  useEffect(() => {
    CortexDriver.getInstance();
  });

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={StartPage} />
        <Route path="/" exact component={centerContainer} />
        <Route path="/verification" exact component={VerificationContainer} />
        <Route path="/select" exact component={SelectProfilePage} />
        <Route path="/ip" exact component={AddIpPage} />
        <Route path="/stream" exact component={StreamPage} />
      </Switch>
    </Router>
  );
}
