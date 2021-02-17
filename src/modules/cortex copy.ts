import {
  QueryHeadsetIdObject,
  QueryProfileObject,
  QueryProfileResult,
  RequestAccessObject,
  SetupProfileObject,
} from './interfaces';

//let WebSocket = require('isomorphic-ws');
require('events').EventEmitter.defaultMaxListeners = 15;
//TODO 
// - Refactor the code for our use.
// - Handle rejects in async functions.
// - Handle errors being thrown. 
//
// ---------------------------------------------------------    
/**
 * This class handle:
 *  - create websocket connection
 *  - handle request for : headset , request access, control headset ...
 *  - handle 2 main flows : sub and train flow
 *  - use async/await and Promise for request need to be run on sync
 */

async function init(){
  
  await checkGrantAccessAndQuerySessionInfo();
  
}
  // Find and connects a headset. If there are more than one headset it connects to the first headset.
  async function queryHeadsetId(socket:WebSocket) {
    const QUERY_HEADSET_ID = 2
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
              reject('Cant find any headset. Please connect a headset to your pc.');
            }
          }

        } catch (error) { }
      }
    })
  }

  //Requests acces to the emotive app. When the script calls this method for the first time 
  //a display message is shown in the Emotiv app.
  //Returns true and a message string if the user accepts and false and a message string otherwise.
  function requestAccess():Promise<RequestAccessObject> {
    let socket = this.socket
    let user = this.user
    return new Promise<RequestAccessObject>(function (resolve, reject) {
      const REQUEST_ACCESS_ID = 1
      let requestAccessRequest = {
        "id": REQUEST_ACCESS_ID,
        "jsonrpc": "2.0",
        "method": "requestAccess",
        "params": {
          "clientId": user.clientId,
          "clientSecret": user.clientSecret
        },
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
          throw new Error("Can't access the EmotiveBCI application");
        }
      }
    })
  }
  
// Generates the Cortex token. The token can be used for 2 days.
  async function authorize(socket:WebSocket, user:any) {
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

  // Connects to the headset.
  async function controlDevice(headsetId:string, socket:WebSocket) {
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
  async function createSession(socket:WebSocket,authToken:string, headsetId:string,) {
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

  
  function subRequest(socket:WebSocket, stream:string[], authToken:string, sessionId:string) {
    
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

  //This method is to get or set the active action for the mental command detection.
  //If the status is "get" then the result is and array of strings.
  //If the status is "set", then the result is an object with "action" and "message" as fields. 
 function mentalCommandActiveActionRequest(authToken:string, sessionId:string, profile:string, action:string) {
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
  async function querySessionInfo() {
    try{
    this.headsetId = await queryHeadsetId();
    this.ctResult = await controlDevice(this.headsetId); //Variable isn't used anywhere
    await authorize();
    this.sessionId = await createSession(this.authToken, this.headsetId);
    }
     catch(error){
       console.log("query session error: " + error);
     }
  
  }

  /**
   * - check if user logged in.
   * - check if app is granted for access
   * - query session info to prepare for sub and train
   */
  async function checkGrantAccessAndQuerySessionInfo() {
  try{
    let hasAccess:boolean = await this.hasAccess();
    if(!hasAccess){
    let requestAccess:RequestAccessObject = await this.requestAccess();
    let resultMessage:string = requestAccess.result.message;
    let accessGranted:boolean = requestAccess.result.accessGranted;
    let canAccess:boolean = this.canAccessCortexApp(accessGranted,resultMessage);

    if(canAccess){
      await querySessionInfo();
    }
    
    }
    else if(hasAccess){
      await this.querySessionInfo();
    }
  }
    catch(error){
      console.log("implement error handling");
    }
  }

  function canAccessCortexApp(accessGranted:boolean, resultMessage:string):boolean{
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

  function hasAccess() {
    let socket = this.socket
    let user = this.user
    return new Promise<boolean>(function (resolve, reject) {
      const REQUEST_ACCESS_ID = 1
      let requestAccessRequest = {
        "id": REQUEST_ACCESS_ID,
        "jsonrpc": "2.0",
        "method": "requestAccess",
        "params": {
          "clientId": user.clientId,
          "clientSecret": user.clientSecret
        },
      }

      socket.send(JSON.stringify(requestAccessRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        try {
          let accessQuery:RequestAccessObject = JSON.parse(data);
          if (accessQuery.id == REQUEST_ACCESS_ID) {
            console.log("request parsed: " + accessQuery);
            resolve(accessQuery.result.accessGranted);
          }
        } catch (error) {
          reject(new Error("Can't access the Emotive App"));
        }
      }
    })
  }


  /**
   * - check login and grant access
   * - subcribe for stream
   * - logout data stream to console or file
   */
  function sub(streams:any) {
    this.socket.on('open', async () => {
      try{
      await this.checkGrantAccessAndQuerySessionInfo();
      subRequest(streams, this.authToken, this.sessionId)
      this.socket.onmessage = ({data}: MessageEvent) => {
        // log stream data to file or console here
        console.log(data)
      }
    }
    catch(error){
      console.log("Implement error hanlding")
    }
  })
  }

  function setupProfile(socket:WebSocket, authToken:string, headsetId:string, profileName:string, status:string) {
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

    return new Promise(function (resolve) {
      socket.send(JSON.stringify(setupProfileRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        
        let setupQuery:SetupProfileObject = JSON.parse(data);
        
        if (status == 'create') {
          resolve(setupQuery)
        }
        try {
          if (setupQuery.id == SETUP_PROFILE_ID) {
            if (setupQuery.result.action == status) {
              resolve(data);
            }
          }

        } catch (error) {
          console.log("error: " + error);
        }
      }
    })
  }

async function queryProfileRequest(socket:WebSocket,authToken:String) {

    const QUERY_PROFILE_ID = 9
    let queryProfileRequest = {
      "jsonrpc": "2.0",
      "method": "queryProfile",
      "params": {
        "cortexToken": authToken
      },
      "id": QUERY_PROFILE_ID
    }

    return new Promise<string[]>(function (resolve, reject) {
      socket.send(JSON.stringify(queryProfileRequest))
      socket.onmessage = ({data}:MessageEvent) => {
        try {
            let profileQuery: QueryProfileObject = JSON.parse(data);
          if (profileQuery.id == QUERY_PROFILE_ID) {
            let profiles = profileQuery.result;
            let profileNames = [];
          
          for(let i=0; i<profiles.length; i++){
            profileNames.push(profiles[i].name);
          }
            
            resolve(profileNames);
          }
        } catch (error) {
          console.log("Query profile request" + error)
        }
      }
    });
  }

  /**
   * 
   * - load profile which trained before
   * - sub 'com' stream (mental command)
   * - user think specific thing which used while training, for example 'push' action
   * - 'push' command should show up on mental command stream
   */
  async function live(profileName:string) {
    let profilePromise = new Promise((resolve, reject) => {
    this.socket.onopen = async () => {
      
      await this.checkGrantAccessAndQuerySessionInfo();
      const data:any = await this.setupProfile(this.authToken, this.headsetId, profileName, "load")
      // load profile
      //let loadProfileResult = ""
      let parsedData:SetupProfileObject = JSON.parse(data);

      // // sub 'com' stream and view live mode
      subRequest(['com'], this.authToken, this.sessionId)

      this.socket.onmessage = ({data}:MessageEvent) => {
        console.log(data);
        resolve(data);
      }
    }
  });
  return profilePromise;
  
  }
  // Returns an array of profile names. 
  async function getProfiles(authToken:string, socket:WebSocket) {
    let profilePromise = new Promise((resolve, reject) => {

      socket.onopen = async () => {
        try {
          await this.checkGrantAccessAndQuerySessionInfo(); 
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
  async function loadProfile(profileName:string) {
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

export {
  init,
  queryHeadsetId,
  controlDevice,
  authorize,
  queryProfileRequest,
  createSession,
  subRequest
};


