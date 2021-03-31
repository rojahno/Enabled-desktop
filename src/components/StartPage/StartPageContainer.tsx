import { createStyles, makeStyles, Theme } from '@material-ui/core';

import React, { useState } from 'react';
import { FacadeTest } from '../../FacadeTest';
import { CortexDriver } from '../../modules/CortexDriver';
import CortexError from '../../modules/CortexError';
import StartPage from './StartPage';

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

const StartPageContainer = () => {
  const driver = CortexDriver.getInstance();
  const classes = useStyles();

  //StartPage useStates
  const [hasAccessError, setHasAccessError] = useState(true);
  const [headsetIdError, setHeadSetIdError] = useState(false);
  const [deviceError, setDeviceError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  //StartPage functions
  async function connectClicked() {
    try {
      console.log('Before: ' + hasAccessError);
      const facade = new FacadeTest();
      await facade.handleSetupApp();
      let errors: any = facade.getSetupErrors();
      setIsClicked(true);
      console.log('StartPage: Connect clicked');
      setHasAccessError(true);
      setHeadSetIdError(errors[1]);
      setDeviceError(errors[2]);
      console.log('After: ' + errors);
    } catch (error) {
      if (error instanceof CortexError) {
        alert(error.errMessage);
      }
    }
  }

  return (
    <StartPage
      connectClicked={connectClicked}
      hasAccessError={false}
      headsetIdError={headsetIdError}
      deviceError={deviceError}
      isClicked={isClicked}
    />
  );
};

export default StartPageContainer;
