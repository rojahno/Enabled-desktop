import { createStyles, makeStyles, Theme } from '@material-ui/core';

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AddIpPage from './components/addIpPage/AddIpPage';
import StreamPage from './components/streamPage/StreamPage';
import StartPageContainer from './components/StartPage/StartPageContainer';
import SelectProfileContainer from './components/selectProfile/SelectProfileContainer';

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
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Router>
          <Switch>
            <Route path="/" exact component={StartPageContainer} />
            <Route path="/select" exact component={SelectProfileContainer} />
            <Route path="/ip" exact component={AddIpPage} />
            <Route path="/stream" exact component={StreamPage} />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default AppContainer;
