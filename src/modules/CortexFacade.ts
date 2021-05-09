import { CortexDriver } from './CortexDriver';
import CortexError from './CortexError';

class CortexFacade {
  private static instance: CortexFacade;
  private driver = CortexDriver.getInstance();
  private authToken: string = '';
  private constructor() {
  }

  static getInstance(): CortexFacade {
    if (CortexFacade.instance) {
      return CortexFacade.instance;
    }
    CortexFacade.instance = new CortexFacade();
    return CortexFacade.instance;
  }

  /**
   * Unloads the old profile and loads the new profile.
   * @param selectedProfile The selected profile
   * @returns
   */
  SetProfile = async (selectedProfile: string) => {
    try {
      if (!this.driver.isConnected()) {
        let connected = await this.driver.awaitSocketOpening();
        if (!connected) {
          return new CortexError(6, '');
        }
      }
      let authoken: string = await this.driver.authorize();
      let headsetId: string = await this.driver.queryHeadsetId();

      let hasLoadedProfile = await this.driver.hasCurrentProfile(
        authoken,
        headsetId
      );

      if (hasLoadedProfile) {
        await this.driver.setupProfile(authoken, headsetId, '', 'unload');
      }
      await this.driver.setupProfile(
        authoken,
        headsetId,
        selectedProfile,
        'load'
      );

      return;
    } catch (error) {
      console.log(error);
      return this.errorHandling(error);
    }
  };

  /**
   * Checks for errors from the Emotiv API.
   * @returns false if no errors occured and an error object if an error occures
   */
  hasConnectivityErrors = async () => {
    try {
      let driver: CortexDriver = CortexDriver.getInstance();
      this.authToken = await driver.authorize();
      let headsetId: string = await driver.queryHeadsetId();
      let hasLoadedProfile = await driver.hasCurrentProfile(
        this.authToken,
        headsetId
      );

      return false;
    } catch (error) {
      console.log(error);
      return this.errorHandling(error);
    }
  };

  /**
   * Handles the setup and checks for potensial errors.
   */
  handleSetup = async () => {
    try {
      if (!this.driver.isConnected()) {
        let connected = await this.driver.awaitSocketOpening();
        if (!connected) {
          return new CortexError(1, '');
        }
      }
      let hasAccess = await this.driver.hasAccess();
      if (!hasAccess) {
        let requestAccess = await this.driver.requestAccess();
        if (!requestAccess) {
          return new CortexError(3, '');
        }
      }
      // If an QueryHeadsetId error occurs, it will be catched in the catch clause.
      let headsetID = await this.driver.queryHeadsetId();

      let connectData: string = await this.driver.controlDevice(headsetID);
      if (connectData.indexOf('error') !== -1) {
        return new CortexError(9, '');
      }

      return;
    } catch (error) {
      return this.errorHandling(error);
    }
  };

  /**
   * Check if the error was an instance of Cortex error.
   * @param error The error we would like to check.
   * @returns The cortex error
   */
  errorHandling(error: any) {
    if (error instanceof CortexError) {
      return error;
    } else {
      return new CortexError(7, '');
    }
  }
}
export { CortexFacade };
