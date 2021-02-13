import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './styles/App.global.css';
import FrontPage from './components/FrontPage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={FrontPage} />
      </Switch>
    </Router>
  );
}
