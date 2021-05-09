import React, { useState } from 'react';
import CortexError from '../../modules/CortexError';
import { CortexFacade } from '../../modules/CortexFacade';
import StartPage from './StartPage';

const StartPageContainer = () => {
  //StartPage useStates
  const [hasAccessError, setHasAccessError] = useState(true);
  const [headsetIdError, setHeadSetIdError] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [deviceError, setDeviceError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  /**
   * Handles the connect button beeing clicked.
   */
  async function connectClicked() {
    try {
      const facade = CortexFacade.getInstance();
      let setupErrors: CortexError | undefined = await facade.handleSetup();

      if (setupErrors instanceof CortexError) {
        setHasError(true);
        if (setupErrors.id == 1 || setupErrors.id == 3) {
          setHasAccessError(true);
        } else {
          setHasAccessError(false);
        }

        if (setupErrors.id == 2) {
          setHeadSetIdError(true);
        } else {
          false;
        }

        if (setupErrors.id == 9) {
          setDeviceError(true);
        } else {
          setDeviceError(false);
        }
      } else {
        setHasError(false);
        setHasAccessError(false);
        setHeadSetIdError(false);
        setDeviceError(false);
      }
      setIsClicked(true);
    } catch (error) {
      if (error instanceof CortexError) {
        alert(error.errMessage);
      }
    }
  }
  return (
    <StartPage
      hasError={hasError}
      connectClicked={connectClicked}
      hasAccessError={hasAccessError}
      headsetIdError={headsetIdError}
      deviceError={deviceError}
      isClicked={isClicked}
    />
  );
};

export default StartPageContainer;
