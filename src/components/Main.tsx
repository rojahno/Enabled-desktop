import { Socket } from 'net';
import React from 'react';

import {
    authorize,
    controlDevice,
    createSession,
    queryHeadsetId,
    queryProfileRequest,
    subRequest,
} from './../modules/cortex copy';
import { QueryProfileObject, QueryProfileResult } from './../modules/interfaces';

const webSocket = new WebSocket('wss://localhost:6868');
const user = {
    "license": "",
    "clientId": "0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV",
    "clientSecret": "HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ",
    "debit": 1
};
const clientId = "0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV";
const clientSecret ="HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ"


class Main extends React.Component{
    state = {
        headsetId: "",
        controlId: "",
        cortexToken: "",
        profiles:[],
        errorMsg:"",
        sessionId:"",
        stream:"",
    }
        componentDidMount() {
        webSocket.onopen = async() => {
           await this.initCortex();
            console.log('Hello');
        }
    }

    initCortex= async () => {
        try{
        const id = await queryHeadsetId(webSocket);
        this.setState({headsetId:id});
        
        const controlID = await controlDevice(this.state.headsetId,webSocket);
        this.setState({controlId:controlID});

        const token = await authorize(webSocket, user);
        this.setState({cortexToken:token});
        
        const sessionId = await createSession(webSocket, this.state.cortexToken,this.state.headsetId);
        this.setState({sessionId:sessionId});
        }
        catch(error){
            this.setState({errorMsg:"check headset and connection"})
        }
    }
    
    getProfiles= async()=> {
            
            const profiles:string[] = await queryProfileRequest(webSocket, this.state.cortexToken);
            this.setState({profiles:profiles});
    }

    removeProfiles= () => {
        let profile:string[] = [];
        this.setState({profiles:profile});
    }

    getStream = () => {

        const stream:string[] = ["com"];
        const subRequest = this.createSubRequest(stream, this.state.cortexToken, this.state.sessionId);
        
        webSocket.send(JSON.stringify(subRequest));
        webSocket.onmessage =({data}:MessageEvent) =>{
            
            try{
                this.setState({stream:data});
            }
            catch(error){
                console.log("don fucked up");
            }
        }
         
        
    }
    createSubRequest=(stream:string[], authToken:string, sessionId:string) =>{
        
        const SUB_REQUEST_ID = 6
        let subRequest = {
            "id": SUB_REQUEST_ID,
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "cortexToken": authToken,
                "session": sessionId,
                "streams": stream
      },
        }

        return subRequest;
    }
    

    render() {
        return(
            <div>
            <div className="Hello">
                {this.state.errorMsg}
               <br/>
            {this.state.headsetId}
            <br/>
            {this.state.controlId}
            <br/>
            {/*{this.state.cortexToken} */}
            </div>
            <ul className="profileButtons"> 
                {this.state.profiles.map((profile: React.ReactNode) => {
                    return <button>{profile}</button>
                })} 

            </ul>

            <button type={"button"} onClick= { async () => {
                await this.getProfiles();
                
            }}>
                Click for å få profiler
            </button>
            <button onClick={this.removeProfiles}>
                Fjern profiler!
            </button>
            <button onClick={this.getStream}>
                start streamen
            </button>
           
          </div>
        )
       }
    }
    export default Main;