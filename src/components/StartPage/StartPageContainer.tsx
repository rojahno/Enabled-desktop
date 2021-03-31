import { createStyles, makeStyles, Theme } from '@material-ui/core';

import React, { useState } from 'react';
import { FacadeTest } from '../../FacadeTest';
import { CortexDriver } from '../../modules/CortexDriver';
import CortexError from '../../modules/CortexError';
import StartPage from './StartPage';

const StartPageContainer = () => {
  //StartPage useStates
  const [hasAccessError, setHasAccessError] = useState(true);
  const [headsetIdError, setHeadSetIdError] = useState(true);
  const [deviceError, setDeviceError] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  //StartPage functions
  async function connectClicked() {
    try {
      const facade = new FacadeTest();
      await facade.handleSetupApp();
      let errors: any = facade.getSetupErrors();

      setIsClicked(true);
      setHasAccessError(errors[0]);
      setHeadSetIdError(errors[1]);
      setDeviceError(errors[2]);
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
