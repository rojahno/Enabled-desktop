import { createStyles, makeStyles, Theme } from '@material-ui/core';

import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import StartPageContainer from './components/startPage/StartPageContainer';
import SelectProfileContainer from './components/selectProfile/SelectProfileContainer';
import AddIpContainer from './components/addIpPage/AddIpContainer';
import StreamContainer from './components/streamPage/StreamContainer';
import { CortexDriver } from './modules/CortexDriver';

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
      lineHeight: '1',
      marginBlockEnd: '0',
    },
  })
);

const AppContainer = () => {
  useEffect(() => {
    const start = async () => {
      let driver: CortexDriver = CortexDriver.getInstance();
      await driver.awaitSocketOpening();
    };
    start();
  });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Router>
          <Switch>
            <Route path="/" exact component={StartPageContainer} />
            <Route path="/select" exact component={SelectProfileContainer} />
            <Route path="/ip" exact component={AddIpContainer} />
            <Route path="/stream" exact component={StreamContainer} />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default AppContainer;
