import './styles/App.global.scss';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ConnectedIndicator from './components/connectedIndicator';
import FrontPage from './components/FrontPage';
import Main from './components/Main';
import SetProfile from './components/setProfile';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={FrontPage} />
        <Route path="/find-ip" exact component={Main} />
        <Route path="/" component={SetProfile} />
        <Route path="/" component={ConnectedIndicator} />
        <Route path="/" component={FrontPage} />
      </Switch>
    </Router>
  );
}
