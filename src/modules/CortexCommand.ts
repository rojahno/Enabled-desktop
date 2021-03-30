import { ComDataSample, FacDataSample } from "./interfaces";

class CortexCommand {
    private streamType:string;
    private command:string
    private dataSampleObject:ComDataSample | FacDataSample;
    constructor(streamType:string, command:string, dataSampleObject:ComDataSample | FacDataSample){
        this.streamType = streamType;
        this.command = command;
        this.dataSampleObject = dataSampleObject;
    }
    public getStreamType(){
        return this.streamType;
    }
    public getCommand(){
        return this.command;
    }
    public getDataSampleObject(){
        return this.dataSampleObject;
    }
}

export default CortexCommand;