import { createStyles, makeStyles, Theme } from '@material-ui/core';

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import { CortexDriver } from './modules/CortexDriver';
import AddIpPage from './components/addIpPage/AddIpPage';
import SelectProfilePage from './components/selectProfile/SelectProfilePage';
import StreamPage from './components/streamPage/StreamPage';
import StartPage from './components/StartPage/StartPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

const AppContainer = () => {
  const classes = useStyles();

  useEffect(() => {
    const start = async () => {
      let driver: CortexDriver = CortexDriver.getInstance();
      await driver.awaitSocketOpening();
    };
    start();
  });

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Router>
          <Switch>
            <Route path="/" exact component={StartPage} />
            <Route path="/select" exact component={SelectProfilePage} />
            <Route path="/ip" exact component={AddIpPage} />
            <Route path="/stream" exact component={StreamPage} />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default AppContainer;
