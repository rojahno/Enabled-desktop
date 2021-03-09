
import { CortexDriver } from "./modules/CortexDriver";

class FacadeTest {
    private authToken : string = ''
    private headsetID: string = ''
    private driver = CortexDriver.getInstance();
    
    
    async getHasAccess() {
        try{
            return await this.driver.hasAccess()
        }
        catch(error){
            return this.errorHandling(error)  
        }
        
        
    }
    async getheadsetID() {
        try{
            this.headsetID = await this.driver.queryHeadsetId()
            return this.headsetID
        }
        catch(error){
            return this.errorHandling(error)
        }
    }
    async getDevice() {
        try{
            return await this.driver.controlDevice(this.headsetID)
            
        }
        catch(error){
            return this.errorHandling(error)
        }
    }
    async getAuthToken() {
        try{
            this.authToken = await this.driver.authorize()
            return this.authToken
        }
        catch(error){
            return this.errorHandling(error)
        }
    }
    async getCurrentProfile() {
        try{
            return await this.driver.getCurrentProfile(this.authToken,this.headsetID)
        
        }
        catch(error){
            return this.errorHandling(error)
        }
    }
    
    errorHandling(error : string){
        if(typeof error === 'string') {
            return error
        }
        else{
            return 'An error has occured'
        }        
    }
    async facadeFunction(i:number){ 
        let f = await[this.getHasAccess(),this.getheadsetID(),this.getDevice()]
        return f[i]
    }
    
} 
export {FacadeTest}