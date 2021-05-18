import { CortexDriver } from './CortexDriver';
import CortexError from './CortexError';
/**
 * @class
 * A facade class for the Cortex Driver. Intended to make it easier to use some of the functionality that the CortexAPI offers.
 */
class CortexFacade {
  private static instance: CortexFacade;
  private driver = CortexDriver.getInstance();
  private authToken: string = '';
  private headsetId: string = '';
  private sessionId: string = '';
  private profile: string = '';
  private allProfiles: string[] = [];

  private constructor() {}

  static getInstance(): CortexFacade {
    if (CortexFacade.instance) {
      return CortexFacade.instance;
    }
    CortexFacade.instance = new CortexFacade();
    return CortexFacade.instance;
  }

  /**
   * Fetches the users from the Cortex driver.
   * Returns an array of all the profile names.
   */
  getProfiles = async () => {
    try {
      this.authToken = await this.driver.authorize();
      this.allProfiles = await this.driver.queryProfileRequest(this.authToken);
      return this.allProfiles;
    } catch (error) {
      return this.errorHandling(error);
    }
  };

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
      this.authToken = await this.driver.authorize();
      this.headsetId = await this.driver.queryHeadsetId();

      let hasLoadedProfile = await this.driver.hasCurrentProfile(
        this.authToken,
        this.headsetId
      );

      if (hasLoadedProfile) {
        await this.driver.setupProfile(
          this.authToken,
          this.headsetId,
          '',
          'unload'
        );
      }
      await this.driver.setupProfile(
        this.authToken,
        this.headsetId,
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
   * Changes the sensitivity for the mental commands. Is currently only supported for the Com-stream.
   * @param sensitivity The new sensitivity for the headset
   * @param isComStream A boolean to confirm that the current stream is the com stream.
   * @returns Undefined or a CortexError if an error occurrs.
   */
  setHeadsetSensitivity = async (
    sensitivity: number[],
    isComStream: boolean
  ) => {
    try {
      this.profile = await this.driver.getCurrentProfile(
        this.authToken,
        this.headsetId
      );
      await this.driver.setSensitivity(
        this.authToken,
        this.profile,
        this.sessionId,
        sensitivity
      );
      await this.driver.saveProfile(
        this.authToken,
        this.headsetId,
        this.profile
      );
      if (isComStream) {
        this.driver.setComStreamOnmessageEvent();
      } else {
        this.driver.setFacStreamOnmessageEvent();
      }
      return;
    } catch (error) {
      return this.errorHandling(error);
    }
  };

  /**
   * Fetches all the needed data and starts the Com-stream.
   * @returns Undefined or a CortexError if an error occurrs.
   */
  startStream = async () => {
    try {
      this.headsetId = await this.driver.queryHeadsetId();
      this.sessionId = await this.driver.createSession(
        this.authToken,
        this.headsetId
      );
      this.profile = await this.driver.getCurrentProfile(
        this.authToken,
        this.headsetId
      );
      await this.driver.startComStream(this.authToken, this.sessionId);
      return;
    } catch (error) {
      return this.errorHandling(error);
    }
  };

  closeSession = async () => {
    await this.driver.closeSession();
  };

  /**
   * Checks for errors from the Emotiv API.
   * @returns false if no errors occured and an error object if an error occures
   */
  hasConnectivityErrors = async () => {
    try {
      this.authToken = await this.driver.authorize();
      this.headsetId = await this.driver.queryHeadsetId();

      return false;
    } catch (error) {
      console.log(error);
      return this.errorHandling(error);
    }
  };

/**
 * Closes the session, opens a new one and changes the stream to the Fac-stream.
 * @returns Undefined or a CortexError if an error occurrs.
 */
  changeToFacStream = async () => {
    try {
      await this.driver.closeSession();
      this.sessionId = await this.driver.createSession(
        this.authToken,
        this.headsetId
      );
      await this.driver.setFacialExpressionSignatureType(
        this.authToken,
        this.sessionId
      );
      await this.driver.startFacStream(this.authToken, this.sessionId);
      return;
    } catch (error) {
      return this.errorHandling(error);
    }
  };

  /**
 * Closes the session, opens a new one and changes the stream to the Com-stream.
 * @returns Undefined or a CortexError if an error occurrs.
 */
  changeToComStream = async () => {
    try {
      await this.driver.closeSession();
      this.sessionId = await this.driver.createSession(
        this.authToken,
        this.headsetId
      );
      await this.driver.startComStream(this.authToken, this.sessionId);
      return;
    } catch (error) {
      return this.errorHandling(error);
    }
  };

/**
 * Handles the setup and checks for potential errors.
 * @returns Undefined or a CortexError if an error occurrs.
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
      // If an QueryHeadsetId error occurs, it will be catched in the catch-clause.
      this.headsetId = await this.driver.queryHeadsetId();

      let connectData: string = await this.driver.controlDevice(this.headsetId);
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
