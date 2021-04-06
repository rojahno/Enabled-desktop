import { createStyles, makeStyles, Theme } from '@material-ui/core';

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import StartPageContainer from './components/StartPage/StartPageContainer';
import SelectProfileContainer from './components/selectProfile/SelectProfileContainer';
import AddIpContainer from './components/addIpPage/AddIpContainer';
import StreamContainer from './components/streamPage/StreamContainer';

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
      lineHeight:'1',
      marginBlockEnd:'0',
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
            <Route path="/stream" exact component={StartPageContainer} />
            <Route path="/select" exact component={SelectProfileContainer} />
            <Route path="/ip" exact component={AddIpContainer} />
            <Route path="/" exact component={StreamContainer} />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default AppContainer;
