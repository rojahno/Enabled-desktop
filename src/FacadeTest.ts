
import { CortexDriver } from "./modules/CortexDriver";

class FacadeTest {
    private hasAccess: string = 'false';
    private headsetID: string =''
    private device: string = ''
    private authToken: string = ''
    private currentProfile: string = ''
    public errorMsg: string = ''
    private driver = CortexDriver.getInstance();
    constructor() {
    }
    
    
    async getHasAccess() {
        try{
            this.hasAccess= await this.driver.hasAccess().valueOf().toString()
            // console.log(this.hasAccess)
            // return this.hasAccess
        }
        catch(error){
            this.errorMsg = this.errorHandling(error)
            console.log(this.errorMsg)
        }
        
        
    }
    async getheadsetID() {
        try{
            this.headsetID = await this.driver.queryHeadsetId()
            console.log("DUH")
            return this.headsetID
        }
        catch(error){
            return this.errorHandling(error)
        }
    }
    async getDevice() {
        try{
            this.device = await this.driver.controlDevice(this.headsetID)
            return this.device
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
            this.currentProfile = await this.driver.getCurrentProfile(this.authToken,this.headsetID)
            return this.currentProfile
        }
        catch(error){
            return this.errorHandling(error)
        }
    }
    
    errorHandling(error : string){
        if(typeof error === 'string') {
            this.errorMsg = error;
            return this.errorMsg
        }
        else{
            return 'An error has occured'
        }        
    }
    async facadeFunction(i:number){
        let f = await[this.getHasAccess(),this.getheadsetID(),this.getDevice()]
        return f[i]
    }
    facaFields = [this.hasAccess,this.headsetID,this.driver]
    
} 
export {FacadeTest}