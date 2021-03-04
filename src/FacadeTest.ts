
import { CortexDriver } from "./modules/CortexDriver";

class FacadeTest {
    private hasAccess: boolean = false;
    private headsetID: string =''
    private device: string = ''
    private authToken: string = ''
    private currentProfile: string = ''


    async setInformation() {
        let driver = CortexDriver.getInstance();
        this.hasAccess = await driver.hasAccess()
        this.headsetID = await driver.queryHeadsetId()
        this.device = await driver.controlDevice(this.headsetID)
        this.authToken = await driver.authorize()
        this.currentProfile = await driver.getCurrentProfile(this.authToken,this.headsetID)

        }
    
    public get _hasAccess() : boolean {
        return this.hasAccess
    }
    public get _headsetID() : string {
        return this.headsetID
    }
    public get _device() : string {
        return this.device
    }
    public get _authToken() : string {
        return this.authToken
    }
    public get _currentProfile() : string{
        return this.currentProfile
    }
    
} 