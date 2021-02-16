import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './styles/App.global.scss';
import FrontPage from './components/FrontPage';
import OnOffIndicator from './components/OnOffIndicator';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={OnOffIndicator} />
        <Route path="/" component={FrontPage} />
      </Switch>
    </Router>
  );
}
