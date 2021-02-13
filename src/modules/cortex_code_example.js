const WebSocket = require('isomorphic-ws');
require('events').EventEmitter.defaultMaxListeners = 15;

//TODO 
// - Refactor the code for our use.
// - Make the Cortex class a module, so we can import it to our project.
// - Translate the code to TypeScript. 
// ---------------------------------------------------------    
let socketUrl = 'wss://localhost:6868'
let user = {
  "license": "",
  "clientId": "0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV",
  "clientSecret": "HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ",
  "debit": 1
};
/**
 * This class handle:
 *  - create websocket connection
 *  - handle request for : headset , request access, control headset ...
 *  - handle 2 main flows : sub and train flow
 *  - use async/await and Promise for request need to be run on sync
 */
class Cortex {
  constructor(user, socketUrl) {
    // create socket
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    this.socket = new WebSocket(socketUrl);
    console.log(this.socket);
    // read user infor
    this.user = user;

    //let users = this.getProfiles();
  }

  queryHeadsetId() {
    const QUERY_HEADSET_ID = 2
    let socket = this.socket
    let queryHeadsetRequest = {
      "jsonrpc": "2.0",
      "id": QUERY_HEADSET_ID,
      "method": "queryHeadsets",
      "params": {}
    }

    return new Promise(function (resolve, reject) {
      socket.send(JSON.stringify(queryHeadsetRequest));
      socket.onmessage = ({
        data
      }) => {
        try {
          if (JSON.parse(data)['id'] == QUERY_HEADSET_ID) {
            if (JSON.parse(data)['result'].length > 0) {
              let headsetId = JSON.parse(data)['result'][0]['id']
              console.log("headset", headsetId);
              resolve(headsetId)
            } else {
              console.log('Cant find any headset. Please connect a headset to your pc.')
            }
          }

        } catch (error) {}
      }
    })
  }

  requestAccess() {

    let socket = this.socket
    let user = this.user
    return new Promise(function (resolve, reject) {
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

      // console.log('start send request: ',requestAccessRequest)

      socket.send(JSON.stringify(requestAccessRequest));
      socket.onmessage = (data) => {
        try {
          let parsed = JSON.parse(data.data);
          if (parsed['id'] == REQUEST_ACCESS_ID) {
            resolve(parsed);
          }
        } catch (error) {

        }
      }
    })
  }

  authorize() {
    let socket = this.socket
    let user = this.user
    return new Promise(function (resolve, reject) {
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
      socket.onmessage = ({
        data
      }) => {
        try {
          if (JSON.parse(data)['id'] == AUTHORIZE_ID) {
            let cortexToken = JSON.parse(data)['result']['cortexToken']
            resolve(cortexToken)
          }
        } catch (error) {}
      }
    })
  }

  controlDevice(headsetId) {
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
    return new Promise(function (resolve, reject) {
      socket.send(JSON.stringify(controlDeviceRequest));
      socket.onmessage = ({
        data
      }) => {
        try {
          if (JSON.parse(data)['id'] == CONTROL_DEVICE_ID) {
            resolve(data)
          }
        } catch (error) {}
      }
    });
  }

  createSession(authToken, headsetId) {
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
    return new Promise(function (resolve, reject) {
      socket.send(JSON.stringify(createSessionRequest));
      socket.onmessage = ({
        data
      }) => {
        try {
          if (JSON.parse(data)['id'] == CREATE_SESSION_ID) {
            let sessionId = JSON.parse(data)['result']['id']
            resolve(sessionId)
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  subRequest(stream, authToken, sessionId) {
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
    //  console.log('sub eeg request: ', subRequest)
    socket.send(JSON.stringify(subRequest))
    socket.onmessage = (data) => {
      try {
        // if(JSON.parse(data)['id']==SUB_REQUEST_ID){
        //console.log('SUB REQUEST RESULT --------------------------------')
        //console.log(data)
        //console.log('\r\n')
        // }
      } catch (error) {}
    }
  }

  mentalCommandActiveActionRequest(authToken, sessionId, profile, action) {
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
    // console.log(mentalCommandActiveActionRequest)
    return new Promise(function (resolve, reject) {
      socket.send(JSON.stringify(mentalCommandActiveActionRequest))
      socket.onmessage = (data) => {
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

    this.ctResult = await this.controlDevice(this.headsetId);

    this.authToken = await this.authorize();

    this.sessionId = await this.createSession(this.authToken, this.headsetId);
    /*
        console.log('\r\n')
        console.log('HEADSET ID -----------------------------------')
        console.log(this.headsetId)
        console.log('\r\n')
        console.log('CONNECT STATUS -------------------------------')
        console.log(this.ctResult)
        console.log('\r\n')
        console.log('AUTH TOKEN -----------------------------------')
        console.log(this.authToken)
        console.log('\r\n')
        console.log('SESSION ID -----------------------------------')
        console.log(this.sessionId);
        console.log('\r\n')
        */
  }

  /**
   * - check if user logined
   * - check if app is granted for access
   * - query session info to prepare for sub and train
   */
  async checkGrantAccessAndQuerySessionInfo() {
    let requestAccessResult = ""

    await this.requestAccess().then((result) => {
      requestAccessResult = result

    })

    let accessGranted = requestAccessResult;

    // check if user is logged in CortexUI
    if ("error" in accessGranted) {
      console.log('You must login on CortexUI before request for grant access then rerun')
      throw new Error('You must login on CortexUI before request for grant access')
    } else {
      console.log(accessGranted['result']['message'])
      // console.log(accessGranted['result'])
      if (accessGranted['result']['accessGranted']) {
        await this.querySessionInfo()

      } else {
        console.log('You must accept access request from this app on CortexUI then rerun')
        throw new Error('You must accept access request from this app on CortexUI')
      }
    }
  }

  /**
   * - check login and grant access
   * - subcribe for stream
   * - logout data stream to console or file
   */
  sub(streams) {
    this.socket.on('open', async () => {
      await this.checkGrantAccessAndQuerySessionInfo()
      this.subRequest(streams, this.authToken, this.sessionId)
      socket.onmessage = (data) => {
        // log stream data to file or console here
        //console.log(data)
      }
    })
  }

  setupProfile(authToken, headsetId, profileName, status) {
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
    return new Promise(function (resolve, reject) {
      socket.send(JSON.stringify(setupProfileRequest));
      socket.onmessage = ({
        data
      }) => {
        if (status == 'create') {
          resolve(data)
        }

        try {
          // console.log('inside setup profile', data)
          if (JSON.parse(data)['id'] == SETUP_PROFILE_ID) {
            console.log("eskil");
            let parsed = JSON.parse(data);
            console.table(parsed);
            if (JSON.parse(data)['result']['action'] == status) {
              // console.log('SETUP PROFILE -------------------------------------')
              //console.log(data)
              //console.log('\r\n')
              resolve(data)
            }
          }

        } catch (error) {
          console.log("error: " + error);

        }
      }
    })
  }

  queryProfileRequest(authToken) {

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
      socket.onmessage = ({
        data
      }) => {
        try {
          if (JSON.parse(data)['id'] == QUERY_PROFILE_ID) {
            /*console.log('\r\n')
            console.log("query profile: ")
            console.log(data)
            */
            resolve(data)
          }
        } catch (error) {
          console.log("query profile error:")
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
  live(profileName) {
    this.socket.onopen = async () => {

      await this.checkGrantAccessAndQuerySessionInfo()

      // load profile
      let loadProfileResult = ""
      let status = "load"
      await this.setupProfile(this.authToken,
        this.headsetId,
        profileName,
        status).then((result) => {
        loadProfileResult = result
      })
      console.log("loaded profile result: " + loadProfileResult)

      // // sub 'com' stream and view live mode
      this.subRequest(['com'], this.authToken, this.sessionId)

      this.socket.on('message', (data) => {
        console.log(data)
      })
    }
  }
  // Maybe return a promise instead?? Check when module is implemented.
  async getProfiles() {

    this.parsedData = "goodbye";
    let profilePromise = new Promise((resolve, reject) => {

      this.socket.onopen = async () => {

        try {
          await this.checkGrantAccessAndQuerySessionInfo();
          // Checks and sets the class variables needed for the profile query. 
          const data = await this.queryProfileRequest(this.authToken);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }
    })
    return profilePromise;
  }


  // The load function only works one time. Need to unload function or restart the app to test further.
  async loadProfile(profileName) {
    let loadPromise = new Promise((resolve, reject) => {
      this.socket.onopen = async () => {

        await this.checkGrantAccessAndQuerySessionInfo()
        const data = await this.setupProfile(this.authToken, this.headsetId, profileName, "load")
        let parsedData = JSON.parse(data);
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
//let c = new Cortex(user, socketUrl)
//let streams = ['com']
//c.sub(streams);
//c.getProfiles();
//c.loadProfile("D7");
//console.log("auth: " + auth);

/*
eeg
The raw EEG data from the headset.
mot
The motion data from the headset.
dev
The device data from the headset. It includes the battery level, the wireless signal strength, and the contact quality of each EEG sensor.
pow
The band power of each EEG sensor. It includes the alpha, low beta, high beta, gamma, and theta bands.
met
The results of the performance metrics detection.
com
The results of the mental commands detection. You must load a profile to get meaningful results.
fac
The results of the facial expressions detection.
sys
The system events. These events are related to the training of the mental commands and facial expressions. See BCI for details.
*/
