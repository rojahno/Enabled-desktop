import './styles/App.global.scss';

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import centerContainer from './components/frontpage/CenterContainer';

import SettingsDialogue from './components/settings/SettingsDialogue';
import VerificationContainer from './components/verification/VerificationContainer';
import Main from './components/Main';
import { useEffect } from 'react';
import { CortexDriver } from './modules/CortexDriver';

export default function App() {

  useEffect(() => {
  CortexDriver.getInstance();
  });
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={centerContainer} />
        <Route path="/verification" exact component={VerificationContainer} />
        <Route path="/settings" exact component={SettingsDialogue} />
        <Route path="/main" exact component={Main} />
        <Route path="/" exact component={centerContainer} />
      </Switch>
    </Router>
  );
}
