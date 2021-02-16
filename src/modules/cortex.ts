let WebSocket = require('isomorphic-ws');
require('events').EventEmitter.defaultMaxListeners = 15;
import {RequestAccessObject, SetupProfileObject, QueryHeadsetIdObject, QueryProfileObject} from "./interfaces";

//TODO 
// - Refactor the code for our use.
// - Handle rejects in async functions.
// . Handle errors being thrown. 
// ---------------------------------------------------------    
/**
 * This class handle:
 *  - create websocket connection
 *  - handle request for : headset , request access, control headset ...
 *  - handle 2 main flows : sub and train flow
 *  - use async/await and Promise for request need to be run on sync
 */
class Cortex {
  private socket: any;
  private headsetId:string = "";
  private authToken:string = "";
  private sessionId:string = "";
  private ctResult:string = "";
  private parsedData:string = "";

  constructor(public user:any, socketUrl:string) {
    
    // create socket
    //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; Why is this here? only for node?
    this.socket = new WebSocket(socketUrl);
    this.user = user;
  }


  // Find and connects a headseth. If there are more than one headset it connects to the first headseth.
  queryHeadsetId() {
    const QUERY_HEADSET_ID = 2
    let socket = this.socket;
    let queryHeadsetRequest = {
      "jsonrpc": "2.0",
      "id": QUERY_HEADSET_ID,
      "method": "queryHeadsets",
      "params": {}
    }

    return new Promise<string>(function (resolve, reject) {
      socket.send(JSON.stringify(queryHeadsetRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        try {
          let headsetQuery: QueryHeadsetIdObject = JSON.parse(data);
          let queryHeadsetId:number = headsetQuery.id;
          
          if (queryHeadsetId == QUERY_HEADSET_ID) {
            if (headsetQuery.result.length > 0) {
              let headsetId:string = headsetQuery.result[0].id;
              resolve(headsetId);
            } else {
              console.log('Cant find any headset. Please connect a headset to your pc.');
            }
          }

        } catch (error) { }
      }
    })
  }

  //Requests acces to the emotive app. When the script calls this method for the first time 
  //a display message is shown in the Emotiv app.
  //Returns true and a message string if the user accepts and false and a message string otherwise.
  requestAccess() {
    let socket = this.socket
    let user = this.user
    return new Promise<RequestAccessObject>(function (resolve, reject) {
      const REQUEST_ACCESS_ID = 1
      let requestAccessRequest = {
        "jsonrpc": "2.0",
        "method": "requestAccess",
        "params": {
          "clientId": user.clientId,
          "clientSecret": user.clientSecret
        },
        "id": REQUEST_ACCESS_ID
      }

      socket.send(JSON.stringify(requestAccessRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        try {
          let parsed:RequestAccessObject = JSON.parse(data);
          if (parsed['id'] == REQUEST_ACCESS_ID) {
            console.log("request parsed: " + parsed);
            resolve(parsed);
          }
        } catch (error) {
          reject(new Error("Can't access the Emotive App"));
        }
      }
    })
  }
  
// Generates the Cortex token. The token can be used for 2 days.
  authorize() {
    let socket = this.socket
    let user = this.user
    return new Promise<string>(function (resolve, reject) {
      const AUTHORIZE_ID = 4
      let authorizeRequest = {
        "jsonrpc": "2.0",
        "method": "authorize",
        "params": {
          "clientId": user.clientId,
          "clientSecret": user.clientSecret,
          "license": user.license,
          "debit": user.debit
        },
        "id": AUTHORIZE_ID
      }
      socket.send(JSON.stringify(authorizeRequest))
      socket.onmessage = ({data}:MessageEvent) => {
        try {
          if (JSON.parse(data)['id'] == AUTHORIZE_ID) {
            let cortexToken:string = JSON.parse(data)['result']['cortexToken']
            resolve(cortexToken);
          }
        } catch (error) {}
      }
    });
  }

  controlDevice(headsetId:string) {
    let socket = this.socket
    const CONTROL_DEVICE_ID = 3
    let controlDeviceRequest = {
      "jsonrpc": "2.0",
      "id": CONTROL_DEVICE_ID,
      "method": "controlDevice",
      "params": {
        "command": "connect",
        "headset": headsetId
      }
    }
    return new Promise<any>(function (resolve, reject) {
      socket.send(JSON.stringify(controlDeviceRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        try {
          if (JSON.parse(data)['id'] == CONTROL_DEVICE_ID) {
            resolve(data)
          }
        } catch (error) {}
      }
    });
  }

  // This method is to subscribe to one or more data strams. After you successfully subscribe
  // Cortex will keep sending data sample objects.
  createSession(authToken:string, headsetId:string) {
    let socket = this.socket
    const CREATE_SESSION_ID = 5
    let createSessionRequest = {
      "jsonrpc": "2.0",
      "id": CREATE_SESSION_ID,
      "method": "createSession",
      "params": {
        "cortexToken": authToken,
        "headset": headsetId,
        "status": "active"
      }
    }
    return new Promise<string>(function (resolve, reject) {
      socket.send(JSON.stringify(createSessionRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        try {
          if (JSON.parse(data)['id'] == CREATE_SESSION_ID) {
            let sessionId:string = JSON.parse(data)['result']['id']
            resolve(sessionId)
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  subRequest(stream:any, authToken:string, sessionId:string) {
    let socket = this.socket
    const SUB_REQUEST_ID = 6
    let subRequest = {
      "jsonrpc": "2.0",
      "method": "subscribe",
      "params": {
        "cortexToken": authToken,
        "session": sessionId,
        "streams": stream
      },
      "id": SUB_REQUEST_ID
    }
    
    socket.send(JSON.stringify(subRequest))
    socket.onmessage = ({data}:MessageEvent) => {
      try {
        // if(JSON.parse(data)['id']==SUB_REQUEST_ID){
        //console.log('SUB REQUEST RESULT --------------------------------')
        //console.log(data)
        //console.log('\r\n')
        // }
      } catch (error) {}
    }
  }

  mentalCommandActiveActionRequest(authToken:string, sessionId:string, profile:string, action:string) {
    let socket = this.socket
    const MENTAL_COMMAND_ACTIVE_ACTION_ID = 10
    let mentalCommandActiveActionRequest = {
      "jsonrpc": "2.0",
      "method": "mentalCommandActiveAction",
      "params": {
        "cortexToken": authToken,
        "status": "set",
        "session": sessionId,
        "profile": profile,
        "actions": action
      },
      "id": MENTAL_COMMAND_ACTIVE_ACTION_ID
    }
    return new Promise(function (resolve, reject) {
      socket.send(JSON.stringify(mentalCommandActiveActionRequest))
      socket.onmessage = ({data}:MessageEvent) => {
        try {
          if (JSON.parse(data)['id'] == MENTAL_COMMAND_ACTIVE_ACTION_ID) {
            // console.log('MENTAL COMMAND ACTIVE ACTION RESULT --------------------')
            // console.log(data)
            //console.log('\r\n')
            resolve(data)
          }
        } catch (error) {}
      }
    })
  }

  /**
   * - query headset infor
   * - connect to headset with control device request
   * - authentication and get back auth token
   * - create session and get back session id
   */
  async querySessionInfo() {
    this.headsetId = await this.queryHeadsetId();
    this.ctResult = await this.controlDevice(this.headsetId); //Variable isn't used anywhere
    this.authToken = await this.authorize();
    this.sessionId = await this.createSession(this.authToken, this.headsetId);
  
  }

  /**
   * - check if user logged in.
   * - check if app is granted for access
   * - query session info to prepare for sub and train
   */
  async checkGrantAccessAndQuerySessionInfo() {
    let requestAccess:RequestAccessObject = await this.requestAccess();
    let resultMessage:string = requestAccess.result.message;
    let accessGranted:boolean = requestAccess.result.accessGranted;

    let canAccess:boolean = this.canAccessCortexApp(accessGranted,resultMessage);
    if(canAccess){
      await this.querySessionInfo();
    }
  }

  canAccessCortexApp(accessGranted:boolean, resultMessage:string):boolean{
    let canAccess = false;
    if (resultMessage.indexOf('error') !== -1) {
      console.log('You must login on CortexUI before request for grant access then rerun')
      throw new Error('You must login on CortexUI before request for grant access')
    } 
    else if(!accessGranted) {
       console.log('You must accept access request from this app on CortexUI then rerun')
       throw new Error('You must accept access request from this app on CortexUI')
    }
    else if(accessGranted){
       canAccess = true;
    }
    return canAccess;

  }
  /**
   * - check login and grant access
   * - subcribe for stream
   * - logout data stream to console or file
   */
  sub(streams:any) {
    this.socket.on('open', async () => {
      await this.checkGrantAccessAndQuerySessionInfo()
      this.subRequest(streams, this.authToken, this.sessionId)
      this.socket.onmessage = ({data}: MessageEvent) => {
        // log stream data to file or console here
        console.log(data)
      }
    })
  }

  setupProfile(authToken:string, headsetId:string, profileName:string, status:string) {
    const SETUP_PROFILE_ID = 7
    let setupProfileRequest = {
      "jsonrpc": "2.0",
      "method": "setupProfile",
      "params": {
        "cortexToken": authToken,
        "headset": headsetId,
        "profile": profileName,
        "status": status
      },
      "id": SETUP_PROFILE_ID
    }
    // console.log(setupProfileRequest)
    let socket = this.socket
    return new Promise(function (resolve) {
      socket.send(JSON.stringify(setupProfileRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        if (status == 'create') {
          let parsed:SetupProfileObject = JSON.parse(data);
          resolve(parsed)
        }

        try {
          // console.log('inside setup profile', data)
          if (JSON.parse(data)['id'] == SETUP_PROFILE_ID) {
            let parsed = JSON.parse(data);
            console.table(parsed);
            if (JSON.parse(data)['result']['action'] == status) {
              resolve(data);
            }
          }

        } catch (error) {
          console.log("error: " + error);
        }
      }
    })
  }

  queryProfileRequest(authToken:String) {

    const QUERY_PROFILE_ID = 9
    let queryProfileRequest = {
      "jsonrpc": "2.0",
      "method": "queryProfile",
      "params": {
        "cortexToken": authToken
      },
      "id": QUERY_PROFILE_ID
    }

    let socket = this.socket
    return new Promise(function (resolve, reject) {
      socket.send(JSON.stringify(queryProfileRequest))
      socket.onmessage = ({data}:MessageEvent) => {
        try {
            let profileQuery: QueryProfileObject = JSON.parse(data);
          if (profileQuery.id == QUERY_PROFILE_ID) {
            resolve(profileQuery);
          }
        } catch (error) {
          console.log("query profile error:");

        }
      }
    })
  }

  /**
   * 
   * - load profile which trained before
   * - sub 'com' stream (mental command)
   * - user think specific thing which used while training, for example 'push' action
   * - 'push' command should show up on mental command stream
   */
  live(profileName:string) {
    this.socket.onopen = async () => {

      await this.checkGrantAccessAndQuerySessionInfo()

      // load profile
      //let loadProfileResult = ""
      const data:any = await this.setupProfile(this.authToken, this.headsetId, profileName, "load")
      let parsedData:SetupProfileObject = JSON.parse(data);

      // // sub 'com' stream and view live mode
      this.subRequest(['com'], this.authToken, this.sessionId)

      this.socket.on('message', (data:any) => {
        console.log(data)
      })
    }
  }
  // Maybe return a promise instead?? Check when module is implemented.
  async getProfiles() {
    let profilePromise = new Promise((resolve, reject) => {

      this.socket.onopen = async () => {
        try {
          await this.checkGrantAccessAndQuerySessionInfo();
          // Checks and sets the class variables needed for the profile query. 
          const data:any = await this.queryProfileRequest(this.authToken);
          let profiles = data.result;
          let profileNames = [];
          for(let i=0; i<profiles.length; i++){
            profileNames.push(profiles[i].name);
          }
          console.log("parsed: " +profiles);
          resolve(profileNames);

        } catch (error) {
          reject(error);
        }
      }
    })
    return profilePromise;
  }

  // The load function only works one time. Need to unload 
  //function or restart the app to test further.
  async loadProfile(profileName:string) {
    let loadPromise = new Promise((resolve, reject) => {
      this.socket.onopen = async () => {

        await this.checkGrantAccessAndQuerySessionInfo()
        const data:any = await this.setupProfile(this.authToken, this.headsetId, profileName, "load")
        let parsedData:SetupProfileObject = JSON.parse(data);
        console.log(parsedData);
        resolve(data);
      }
    })
    return loadPromise;
  }
}
export {
  Cortex
};


