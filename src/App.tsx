import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './styles/App.global.scss';
import FrontPage from './components/FrontPage';
import Main from './components/Main';
import ConnectedIndicator from './components/connectedIndicator';
import SetProfile from './components/setProfile';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
        <Route path="/" component={SetProfile}/>
        <Route path="/" component={ConnectedIndicator} />
        <Route path="/" component={FrontPage} />
      </Switch>
    </Router>
  );
}
