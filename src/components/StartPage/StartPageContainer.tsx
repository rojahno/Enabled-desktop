import React, { useState } from 'react';
import CortexError from '../../modules/CortexError';
import { CortexFacade } from '../../modules/CortexFacade';
import StartPage from './StartPage';

const StartPageContainer = () => {
  //StartPage useStates
  const [hasAccessError, setHasAccessError] = useState(true);
  const [headsetIdError, setHeadSetIdError] = useState(false);
  const [deviceError, setDeviceError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  /**
   * Handles the connect button beeing clicked.
   */
  async function connectClicked() {
    try {
      const facade = new CortexFacade();
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
      hasAccessError={hasAccessError}
      headsetIdError={headsetIdError}
      deviceError={deviceError}
      isClicked={isClicked}
    />
  );
};

export default StartPageContainer;
