import {
  QueryHeadsetIdObject,
  QueryProfileObject,
  QueryProfileResult,
  RequestAccessObject,
  SetupProfileObject,
} from './interfaces';

require('events').EventEmitter.defaultMaxListeners = 15;
//TODO 
// - Refactor the code for our use.
// - Handle rejects in async functions.
// - Handle errors being thrown. 
// - Comment the code.
// - Create test classes.
//
// ---------------------------------------------------------    



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
  async function requestAccess(socket:WebSocket, user:any):Promise<string> {
  
    return new Promise<string>(function (resolve, reject) {
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
            resolve(data);
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
        
      } catch (error) {}
    }
  }

  //This method is to get or set the active action for the mental command detection.
  //If the status is "get" then the result is and array of strings.
  //If the status is "set", then the result is an object with "action" and "message" as fields. 
 function mentalCommandActiveActionRequest(socket:WebSocket ,authToken:string, sessionId:string, profile:string, action:string) {
  
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
            resolve(data)
          }
        } catch (error) {}
      }
    })
  }

  async function hasAccess(socket:WebSocket, user:any) {
  
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

  async function setupProfile(socket:WebSocket, authToken:string, headsetId:string, profileName:string, status:string) {
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

    return new Promise<string>(function (resolve) {
      socket.send(JSON.stringify(setupProfileRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        try {
          
        let setupQuery:SetupProfileObject = JSON.parse(data);
        console.log("setupquery : " +data);
        
        if (data.indexOf('error') !== -1) {
          resolve(data);
        }
        
         else if (status == 'create') {
          resolve(setupQuery.result.message)
        }
          if (setupQuery.id == SETUP_PROFILE_ID) {
            if (setupQuery.result.action == status) {
              resolve(data);
            }
          }

        } catch (error) {
          resolve(error);
          console.log("setup profile error: " + error);
        }
      }
    })
  }

  async function getCurrentProfile(socket:WebSocket, authToken:string, headsetId:string) {
    const SETUP_PROFILE_ID = 7
    let currentProfileRequest = {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "getCurrentProfile",
      "params": {
          "cortexToken": authToken,
          "headset": headsetId,
      }
  }
console.log("her");

    return new Promise<string>(function (resolve) {
      socket.send(JSON.stringify(currentProfileRequest));
      socket.onmessage = ({data}:MessageEvent) => {
        try {
  
        if (data.indexOf('error') !== -1) {
          console.log("was an error");
          resolve(data);
        }
        
          else {

              resolve(data);
  
          }
        } catch (error) {
          resolve(error);
          console.log("current profile error: " + error);
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

  

export {
  queryHeadsetId,
  controlDevice,
  authorize,
  queryProfileRequest,
  createSession,
  subRequest,
  setupProfile,
  hasAccess,
  requestAccess,
  getCurrentProfile,
};


