import { CortexDriver } from './CortexDriver';
import CortexError from './CortexError';

class CortexFacade {
  private authToken: string = '';
  private headsetID: string = '';
  private driver = CortexDriver.getInstance();

  /**
   * @todo test the request access logic.
   */
  checkForSetupErrors = async () => {
    try {
      let hasAccess = await this.driver.hasAccess();
      if (!hasAccess) {
        let gotAccess = await this.driver.requestAccess();
        if (!gotAccess) {
          return new CortexError(3, 'Access denied by user');
        } else {
        }
      }
    } catch (error) {}
  };

  handleSetProfile = async (selectedProfile: string) => {
    try {
      if(!this.driver.isConnected()){
        let connected =  await this.driver.awaitSocketOpening();
        if(!connected){
          return new CortexError(6,"");
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

  hasConnectivityErrors= async () => {
try{
    let driver: CortexDriver = CortexDriver.getInstance();
    let authToken: string = await driver.authorize();
    let headsetId: string = await driver.queryHeadsetId();
    let hasLoadedProfile = await driver.hasCurrentProfile(
      authToken,
      headsetId
    );

    return false;
  }catch(error){
    console.log(error);
      return this.errorHandling(error); 
  }

}
//Refactort errorHandling to handle rejects
  errorHandling(error: any) {
    if (error instanceof CortexError) {
      return error;
    } else {
      return 'An error has occured';
    }
  }
}
export { CortexFacade };
