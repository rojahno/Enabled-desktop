import {
  AuthorizeResponse,
  ControlDeviceObject,
  CreateSessionResponse,
  QueryHeadsetIdObject,
  QueryProfileObject,
  RequestAccessObject,
  SetupProfileObject,
} from './interfaces';

require('events').EventEmitter.defaultMaxListeners = 15;
//TODO
// - Handle rejects in async functions.
// - Handle errors being thrown.
//
// ---------------------------------------------------------
/**
 * This class handle:
 *  - create webthis._socket connection
 *  - handle request for : headset , request access, control headset ...
 *  - handle 2 main flows : sub and train flow
 *  - use async/await and Promise for request need to be run on sync
 */
class CortexDriver {
  private _socket: WebSocket;
  private _user: any;

  constructor() {
    this._socket = new WebSocket('wss://localhost:6868');
    this._user = {
      license: '',
      clientId: '0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV',
      clientSecret:
        'HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ',
      debit: 1,
    };
  }

  public get socket() {
    return this._socket;
  }

  // Find and connects a headset. If there are more than one headset it connects to the first headset.
  async queryHeadsetId() {
    const QUERY_HEADSET_ID = 2;
    let queryHeadsetRequest = {
      jsonrpc: '2.0',
      id: QUERY_HEADSET_ID,
      method: 'queryHeadsets',
      params: {},
    };

    return new Promise<string>((resolve, reject) => {
      this._socket.send(JSON.stringify(queryHeadsetRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let headsetQuery: QueryHeadsetIdObject = JSON.parse(data);
          let queryHeadsetId: number = headsetQuery.id;

          if (queryHeadsetId == QUERY_HEADSET_ID) {
            if (headsetQuery.result.length > 0) {
              let headsetId: string = headsetQuery.result[0].id;
              console.log('query id' + headsetId);
              resolve(headsetId);
            }
          }
        } catch (error) {}
        const rejectString =
          'Cant find any headset. Please connect a headset to your pc and ' +
          'check if the headseth is connected to the Emotive app';
        reject(rejectString);
      };
    });
  }

  //Requests acces to the emotive app. When the script calls this method for the first time
  //a display message is shown in the Emotiv app.
  //Returns true and a message string if the user accepts and false and a message string otherwise.
  requestAccess = async (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const REQUEST_ACCESS_ID = 1;
      let requestAccessRequest = {
        id: REQUEST_ACCESS_ID,
        jsonrpc: '2.0',
        method: 'requestAccess',
        params: {
          clientId: this._user.clientId,
          clientSecret: this._user.clientSecret,
        },
      };
      this._socket.send(JSON.stringify(requestAccessRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let parsed: RequestAccessObject = JSON.parse(data);
          if (parsed['id'] == REQUEST_ACCESS_ID) {
            resolve(data);
          }
        } catch (error) {
          reject("Can't access the Emotive application");
        }
      };
    });
  };

  // Generates the Cortex token. The token can be used for 2 days.
  authorize = async (): Promise<string> => {
    console.log('authorize is called');
    return new Promise<string>((resolve, reject) => {
      const AUTHORIZE_ID = 4;
      let authorizeRequest = {
        jsonrpc: '2.0',
        method: 'authorize',
        params: {
          clientId: this._user.clientId,
          clientSecret: this._user.clientSecret,
          license: this._user.license,
          debit: this._user.debit,
        },
        id: AUTHORIZE_ID,
      };
      this._socket.send(JSON.stringify(authorizeRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let parsed: AuthorizeResponse = JSON.parse(data);
          if (parsed.id == AUTHORIZE_ID) {
            let cortexToken: string = parsed.result.cortexToken;
            resolve(cortexToken);
          }
        } catch (error) {}
        reject('Authorize error');
      };
    });
  };

  // Connects to the headset.
  controlDevice(headsetId: string) {
    const CONTROL_DEVICE_ID = 3;
    let controlDeviceRequest = {
      jsonrpc: '2.0',
      id: CONTROL_DEVICE_ID,
      method: 'controlDevice',
      params: {
        command: 'connect',
        headset: headsetId,
      },
    };
    return new Promise<any>((resolve, reject) => {
      this._socket.send(JSON.stringify(controlDeviceRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let parsedData: ControlDeviceObject = JSON.parse(data);
          if (parsedData.id == CONTROL_DEVICE_ID) {
            resolve(data);
          }
        } catch (error) {
          reject('Control device error');
        }
      };
    });
  }

  // This method is to subscribe to one or more data strams. After you successfully subscribe
  // Cortex will keep sending data sample objects.
  createSession = async (authToken: string, headsetId: string) => {
    const CREATE_SESSION_ID = 5;
    let createSessionRequest = {
      jsonrpc: '2.0',
      id: CREATE_SESSION_ID,
      method: 'createSession',
      params: {
        cortexToken: authToken,
        headset: headsetId,
        status: 'active',
      },
    };
    return new Promise<string>((resolve, reject) => {
      this._socket.send(JSON.stringify(createSessionRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let parsed: CreateSessionResponse = JSON.parse(data);
          if (parsed.id == CREATE_SESSION_ID) {
            let sessionId: string = parsed.result.id;
            resolve(sessionId);
          }
        } catch (error) {
          reject('Create session error');
        }
      };
    });
  };

  //Unused method??
  subRequest = (stream: string[], authToken: string, sessionId: string) => {
    const SUB_REQUEST_ID = 6;
    let subRequest = {
      jsonrpc: '2.0',
      method: 'subscribe',
      params: {
        cortexToken: authToken,
        session: sessionId,
        streams: stream,
      },
      id: SUB_REQUEST_ID,
    };

    this._socket.send(JSON.stringify(subRequest));
    this._socket.onmessage = ({ data }: MessageEvent) => {
      try {
        console.log(data);
      } catch (error) {
        console.error('Sub request error');
      }
    };
  };

  //This method is to get or set the active action for the mental command detection.
  //If the status is "get" then the result is and array of strings.
  //If the status is "set", then the result is an object with "action" and "message" as fields.
  mentalCommandActiveActionRequest = (
    authToken: string,
    sessionId: string,
    profile: string,
    action: string
  ) => {
    const MENTAL_COMMAND_ACTIVE_ACTION_ID = 10;
    let mentalCommandActiveActionRequest = {
      jsonrpc: '2.0',
      method: 'mentalCommandActiveAction',
      params: {
        cortexToken: authToken,
        status: 'set',
        session: sessionId,
        profile: profile,
        actions: action,
      },
      id: MENTAL_COMMAND_ACTIVE_ACTION_ID,
    };
    return new Promise((resolve, reject) => {
      this._socket.send(JSON.stringify(mentalCommandActiveActionRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          if (JSON.parse(data)['id'] == MENTAL_COMMAND_ACTIVE_ACTION_ID) {
            resolve(data);
          }
        } catch (error) {
          reject('mental command active action error');
        }
      };
    });
  };

  hasAccess = async () => {
    return new Promise<boolean>((resolve, reject) => {
      const REQUEST_ACCESS_ID = 1;
      let requestAccessRequest = {
        id: REQUEST_ACCESS_ID,
        jsonrpc: '2.0',
        method: 'requestAccess',
        params: {
          clientId: this._user.clientId,
          clientSecret: this._user.clientSecret,
        },
      };

      this._socket.send(JSON.stringify(requestAccessRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let accessQuery: RequestAccessObject = JSON.parse(data);
          if (accessQuery.id == REQUEST_ACCESS_ID) {
            resolve(accessQuery.result.accessGranted);
          }
        } catch (error) {
          reject("Can't access the Emotive App");
        }
      };
    });
  };

  setupProfile = async (
    authToken: string,
    headsetId: string,
    profileName: string,
    status: string
  ) => {
    const SETUP_PROFILE_ID = 7;
    let setupProfileRequest = {
      jsonrpc: '2.0',
      method: 'setupProfile',
      params: {
        cortexToken: authToken,
        headset: headsetId,
        profile: profileName,
        status: status,
      },
      id: SETUP_PROFILE_ID,
    };

    return new Promise<string>((resolve) => {
      this._socket.send(JSON.stringify(setupProfileRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let setupQuery: SetupProfileObject = JSON.parse(data);
          console.log('setupquery : ' + data);

          if (data.indexOf('error') !== -1) {
            resolve(data);
          } else if (status == 'create') {
            resolve(setupQuery.result.message);
          }
          if (setupQuery.id == SETUP_PROFILE_ID) {
            if (setupQuery.result.action == status) {
              resolve(data);
            }
          }
        } catch (error) {
          resolve('setup profile error: ');
          console.log('setup profile error: ' + error);
        }
      };
    });
  };

  //Returns the current profile loaded to the headseth.
  getCurrentProfile = async (authToken: string, headsetId: string) => {
    let currentProfileRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: 'getCurrentProfile',
      params: {
        cortexToken: authToken,
        headset: headsetId,
      },
    };
    return new Promise<string>((resolve, reject) => {
      this._socket.send(JSON.stringify(currentProfileRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let dataString = JSON.stringify(data);
          if (dataString.indexOf('error') === -1) {
            resolve(data);
          }
        } catch (error) {
          reject('Get current profile error');
        }
      };
    });
  };

  //Gets all the available profiles
  queryProfileRequest = async (authToken: String) => {
    const QUERY_PROFILE_ID = 9;
    let queryProfileRequest = {
      jsonrpc: '2.0',
      method: 'queryProfile',
      params: {
        cortexToken: authToken,
      },
      id: QUERY_PROFILE_ID,
    };

    return new Promise<string[]>((resolve, reject) => {
      this._socket.send(JSON.stringify(queryProfileRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let profileQuery: QueryProfileObject = JSON.parse(data);
          if (profileQuery.id == QUERY_PROFILE_ID) {
            let profiles = profileQuery.result;
            let profileNames = [];

            for (let i = 0; i < profiles.length; i++) {
              profileNames.push(profiles[i].name);
            }
            resolve(profileNames);
          }
        } catch (error) {
          reject('Query all profiles error');
        }
      };
    });
  };
}

export { CortexDriver };