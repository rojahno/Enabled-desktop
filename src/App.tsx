import './styles/App.global.scss';

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import centerContainer from './components/frontpage/CenterContainer';

import SettingsDialogue from './components/settings/SettingsDialogue';
import VerificationContainer from './components/verification/VerificationContainer';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={centerContainer} />
        <Route path="/verification" exact component={VerificationContainer} />
        <Route path="/settings" exact component={SettingsDialogue} />
        <Route path="/" exact component={centerContainer} />
        <Route path="/" exact component={centerContainer} />
      </Switch>
    </Router>
  );
}
