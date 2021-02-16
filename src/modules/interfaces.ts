interface RequestAccessObject{
    id: number,
    jsonrpc: string,
    result: RequestAccessResult, 
}


interface RequestAccessResult{
    accessGranted: boolean,
    message: string,
}

interface SetupProfileObject{
    id:number,
    jsonrpc:string,
    result: SetupProfileResult,
        
    
}
interface SetupProfileResult{
    action: string,
    message: string,
    name: string,
}

interface QueryHeadsetIdObject{
    
        id: number,
        jsonrpc:string ,
        result:Array<QueryHeadsetIdResult>
       
}
interface QueryHeadsetIdResult{
        
        
            connectedBy:string,
            customName: string,
            dongle: string,
            firmware: string,
            id: string,
            motionSensors: Array<string>,
        
            sensors: Array<string>,
            settings: {
                eegRate: number,
                eegRes: number,
                memsRate: number,
                memsRes: number,
                mode: number,
            },
            status: string,
}

interface QueryProfileObject{

        id: number,
        jsonrpc: string,
        result:Array<QueryProfileResult>
}
interface QueryProfileResult{
    name: string,
}

export {RequestAccessObject,RequestAccessResult,SetupProfileObject, SetupProfileResult,QueryHeadsetIdObject,QueryHeadsetIdResult, QueryProfileObject} ;