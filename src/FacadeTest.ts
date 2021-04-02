import { CortexDriver } from './modules/CortexDriver';
import CortexError from './modules/CortexError';

class FacadeTest {
  private authToken: string = '';
  headsetID: string = '';
  private driver = CortexDriver.getInstance();
  accessError: boolean = true;
  headsetError: boolean = true;
  deviceError: boolean = true;

  handleSetupApp = async () => {
    try {
      if (!this.driver.isConnected()) {
        let connected = await this.driver.awaitSocketOpening();
        if (!connected) {
          //new CortexError(3,'Access denied by user')
        }
      }
      let hasAccess = await this.driver.hasAccess();
      if (!hasAccess) {
        let requestAccess = await this.driver.requestAccess();
        if (!requestAccess) {
          //new CortexError(6,'')
        }
      }
      this.accessError = false;
      let headsetID = await this.driver.queryHeadsetId();
      console.log('Facade: handleSetupApp');
      this.headsetError = false;
      await this.driver.controlDevice(headsetID);
      this.deviceError = false;
      //return [accessError,headsetError,deviceError]
    } catch (error) {}
  };

  getSetupErrors = () => {
    return [this.accessError, this.headsetError, this.deviceError];
  };

  async getHasAccess() {
    try {
      return await this.driver.hasAccess();
    } catch (error) {
      return;
    }
  }
  async getheadsetID() {
    try {
      this.headsetID = await this.driver.queryHeadsetId();
      return this.headsetID;
    } catch (error) {
      return this.errorHandling(error);
    }
  }
  async getDevice() {
    try {
      return await this.driver.controlDevice(this.headsetID);
    } catch (error) {
      return this.errorHandling(error);
    }
  }
  async getAuthToken() {
    try {
      this.authToken = await this.driver.authorize();
      return this.authToken;
    } catch (error) {
      return this.errorHandling(error);
    }
  }
  async getCurrentProfile() {
    try {
      return await this.driver.getCurrentProfile(
        this.authToken,
        this.headsetID
      );
    } catch (error) {
      return this.errorHandling(error);
    }
  }

  errorHandling(error: string) {
    if (typeof error === 'string') {
      return error;
    } else {
      return 'An error has occured';
    }
  }
  async facadeFunction(i: number) {
    let f = await [this.getHasAccess(), this.getheadsetID(), this.getDevice()];
    return f[i];
  }
}
export { FacadeTest };
