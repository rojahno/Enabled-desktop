import './styles/App.global.scss';

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import ConnectedIndicator from './components/connectedIndicator';
import FrontPage from './components/frontpage/CenterContainer';
import Main from './components/Main';
import SetProfile from './components/setProfile';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={FrontPage} />
        <Route path="/main" exact component={Main} />
        <Route path="/" exact component={ConnectedIndicator} />
        <Route path="/" exact component={FrontPage} />
        <Route path="/" exact component={FrontPage} />
      </Switch>
    </Router>
  );
}
