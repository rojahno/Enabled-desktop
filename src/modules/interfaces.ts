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

export {RequestAccessObject,RequestAccessResult,SetupProfileObject, SetupProfileResult};