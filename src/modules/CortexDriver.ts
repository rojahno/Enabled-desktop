import CortexError from './CortexError';

import {
  AuthorizeResponse,
  ControlDeviceResponse,
  CreateSessionResponse,
  QueryHeadsetIdResponse,
  QueryProfileResponse,
  RequestAccessResponse,
  SetupProfileObject,
  GetCurrentProfileResponse,
  ComDataSample,
  FacDataSample,
  Warning,
  getSensitivityResponse,
  getCommandResponse,
  UpdateSessionResponse,
  FacialExpressionSignatureType,
} from './interfaces';

const CONNECTION_RETRY_INTERVAL = 5000; // in ms
const CONNECTION_RETRY_MAX_COUNT = 60; // 60 times to retry x 5s = 5min of total retries

type StreamObserver = (streamCommand: string) => void;
/**
 * This class works as a connection between an app and the Emotiv API.
 * This class uses async/await and Promise for request and needs to be run on sync.
 *
 */
class CortexDriver {
  private static instance: CortexDriver;
  private _socket!: WebSocket;
  private _user: any;

  private _retryCount: number = 0;
  private observers: IObserver[] = [];

  private cortexToken: string = '';
  private sessionId: string = '';

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
  static getInstance(): CortexDriver {
    if (CortexDriver.instance) {
      return CortexDriver.instance;
    }
    CortexDriver.instance = new CortexDriver();
    return CortexDriver.instance;
  }

  /**
   * Creates a connection to the websocket and sets the events.
   */
  private connect = async () => {
    this._socket = new WebSocket('wss://localhost:6868');

    this.setupSocketEvents();

    // Reconnects if canRetry is true
    if (this._retryCount < CONNECTION_RETRY_MAX_COUNT) {
      setTimeout(this.reconnect, CONNECTION_RETRY_INTERVAL);
    } else {
      // we passed the threshold for retries, let's abort
      this._retryCount = 0;
    }
  };

  public awaitSocketOpening = async () => {
    this._socket = new WebSocket('wss://localhost:6868');

    return new Promise<boolean>((resolve) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve(false);
      }, 5000);
      this.socket.onopen = () => {
        this._retryCount = 0;
        this.setupSocketEvents();
        resolve(true);
      };
    });
  };

  private setupSocketEvents = () => {
    this._socket.onopen = () => {
      console.log('WS OPENED ✅');

      this._retryCount = 0;
    };

    this.socket.onerror = (_error) => {
      if (!this.canRetry()) {
        console.log('An error happened');
      }
    };

    this.socket.onclose = (_error) => {
      // if we aren't retrying...
      if (!this.canRetry()) {
        console.log('Closing');
      }
    };
  };

  /**
   * Checks if the socket status is open
   * @returns true if open.
   */
  public isConnected = (): boolean => {
    return this.getStatus() === 'OPEN';
  };

  /**
   * Makes an attempt to reconect to the server.
   **/
  private reconnect = () => {
    this._retryCount++;
    this.connect();
  };

  /**
   * Checks if we can reconnect or we have reaches our maximun amount of tries.
   **/
  private canRetry(): boolean {
    return this._retryCount > 0;
  }

  /**
   * Returns the socket status or an error string if no socket is found.
   * @returns The socket status
   */
  public getStatus = (): string => {
    if (!this._socket) {
      return 'ERROR: no socket';
    }

    switch (this._socket.readyState) {
      case this._socket.OPEN:
        return 'OPEN';
      case this._socket.CLOSED:
        return 'CLOSED';
      case this._socket.CLOSING:
        return 'CLOSING';
      case this._socket.CONNECTING:
        return 'CONNECTING';
    }
    return 'Unknown error';
  };

  public get socket() {
    return this._socket;
  }

  /**
   * Find and returns a headset id. If there are more than one
   * headset it chooses the first one found.
   *
   * @returns the headseth id
   */
  public queryHeadsetId = async (): Promise<string> => {
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
          if (data.indexOf('error') !== -1) {
            let parsed: Warning = JSON.parse(data);
            console.log(parsed.error.message);
            reject(new CortexError(8, data));
          } else {
            let headsetQuery: QueryHeadsetIdResponse = JSON.parse(data);
            let queryHeadsetId: number = headsetQuery.id;

            if (headsetQuery.result.length < 0) {
              reject(new CortexError(2, data));
            }

            if (queryHeadsetId == QUERY_HEADSET_ID) {
              let headsetId: string = headsetQuery.result[0].id;
              resolve(headsetId);
            }
          }
        } catch (error) {
          reject(new CortexError(2, error));
        }
      };
    });
  };
  /**
   * Requests acces to the emotiv app. When the script calls this method for the first time
   * a display message is shown in the Emotiv app.
   * @returns true and a message string if the user accepts and false and a message string otherwise.
   */

  public requestAccess = async (): Promise<boolean> => {
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
          let parsed: RequestAccessResponse = JSON.parse(data);
          if (parsed.id == REQUEST_ACCESS_ID) {
            resolve(parsed.result.accessGranted);
          }
        } catch (error) {
          reject(new CortexError(3, error));
        }
      };
    });
  };

  /**
   * Generates the Cortex token. The token can be used for 2 days.
   *
   * @returns the Cortex token
   */
  public authorize = async (): Promise<string> => {
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
          if (data.indexOf('error') !== -1) {
            let parsed: Warning = JSON.parse(data);
            console.log(parsed.error.message);
            reject(new CortexError(1, data));
          }
          let parsed: AuthorizeResponse = JSON.parse(data);
          if (parsed.id == AUTHORIZE_ID) {
            let cortexToken: string = parsed.result.cortexToken;
            this.cortexToken = cortexToken;
            resolve(cortexToken);
          }
        } catch (error) {
          reject(new CortexError(3, error));
        }
      };
    });
  };

  /**
   * Connects to a headset based on the headset id.
   *
   * @param headsetId - the headset id returned from queryHeadset.
   * @returns an response object from the Emotiv API.
   * */
  public controlDevice = (headsetId: string): Promise<string> => {
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
    return new Promise<string>((resolve, reject) => {
      this._socket.send(JSON.stringify(controlDeviceRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let parsedData: ControlDeviceResponse = JSON.parse(data);
          if (parsedData.id == CONTROL_DEVICE_ID) {
            resolve(data);
          }
        } catch (error) {
          reject('Control device error');
        }
      };
    });
  };

  /** This method is to open a session with an EMOTIV headset.
   *
   * @returns The data sample obejcts from the session.
   */
  public createSession = async (
    authToken: string,
    headsetId: string
  ): Promise<string> => {
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
            this.sessionId = sessionId;
            resolve(sessionId);
          }
        } catch (error) {
          reject(new CortexError(4, error));
        }
      };
    });
  };

  /**
   * Starts the com stream and notifies the observers.
   *
   * @param authToken - The cortex token
   * @param sessionId - the session id
   */
  public startComStream = async (authToken: string, sessionId: string) => {
    const SUB_REQUEST_ID = 26;
    let subRequest = {
      jsonrpc: '2.0',
      method: 'subscribe',
      params: {
        cortexToken: authToken,
        session: sessionId,
        streams: ['com'],
      },
      id: SUB_REQUEST_ID,
    };
    return new Promise<boolean>((resolve) => {
      this._socket.send(JSON.stringify(subRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          if (JSON.stringify(data).indexOf('jsonrpc') === -1) {
            let parsed: ComDataSample = JSON.parse(data);
            this.notify(parsed);
            resolve(true);
          }
        } catch (error) {
          console.error('Com request error: ' + error);
          resolve(false);
        }
      };
    });
  };

  /**
   * Starts the fac stream and notifies the observers.
   *
   * @param authToken - The cortex token
   * @param sessionId - the session id
   */
  public startFacStream = async (authToken: string, sessionId: string) => {
    const SUB_REQUEST_ID = 26;
    let subRequest = {
      jsonrpc: '2.0',
      method: 'subscribe',
      params: {
        cortexToken: authToken,
        session: sessionId,
        streams: ['fac'],
      },
      id: SUB_REQUEST_ID,
    };
    return new Promise<boolean>((resolve) => {
      this._socket.send(JSON.stringify(subRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          if (JSON.stringify(data).indexOf('jsonrpc') === -1) {
            let parsed: FacDataSample = JSON.parse(data);
            this.notify(parsed);
            resolve(true);
          }
        } catch (error) {
          console.error('Fac request error: ' + error);
          resolve(false);
        }
      };
    });
  };

  public setFacialExpressionSignatureType = async (
    authToken: string,
    sessionId: String
  ) => {
    const SIGNATURE_REQUEST_ID = 26;
    let request = {
      id: SIGNATURE_REQUEST_ID,
      jsonrpc: '2.0',
      method: 'facialExpressionSignatureType',
      params: {
        cortexToken: authToken,
        status: 'set',
        session: sessionId,
        signature: 'trained',
      },
    };

    return new Promise<string>((resolve) => {
      this._socket.send(JSON.stringify(request));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let parsed: FacialExpressionSignatureType = JSON.parse(data);
          if (parsed.id === SIGNATURE_REQUEST_ID) {
            resolve(data);
          }
        } catch (error) {
          console.error('Facial signature error');
        }
      };
    });
  };
  /**
   * Closes the session.
   * @returns The response object from the Emotiv API.
   */
  public closeSession = async () => {
    const CLOSE_REQUEST_ID = 19;
    let subRequest = {
      jsonrpc: '2.0',
      method: 'updateSession',
      params: {
        cortexToken: this.cortexToken,
        session: this.sessionId,
        status: 'close',
      },
      id: CLOSE_REQUEST_ID,
    };
    return new Promise<boolean>((resolve) => {
      if (this.cortexToken) this._socket.send(JSON.stringify(subRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let parsed: UpdateSessionResponse = JSON.parse(data);
          if (parsed.id === CLOSE_REQUEST_ID) {
            resolve(data);
          }
        } catch (error) {
          console.error('Close request error');
        }
      };
    });
  };

  /**
   * This method is to get the active action for the mental command detection.
   *If the status is "get" then the result is and array of strings.
   * @param authToken - The cortex token
   * @param profile - the headset profile
   **/
  public getMentalCommandActiveActionRequest = (
    authToken: string,
    profile: string
  ) => {
    const MENTAL_COMMAND_ACTIVE_ACTION_ID = 10;
    let mentalCommandActiveActionRequest = {
      jsonrpc: '2.0',
      method: 'mentalCommandActiveAction',
      params: {
        cortexToken: authToken,
        profile: profile,
        status: 'get',
      },
      id: MENTAL_COMMAND_ACTIVE_ACTION_ID,
    };
    return new Promise<string[]>((resolve, reject) => {
      this._socket.send(JSON.stringify(mentalCommandActiveActionRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          if (JSON.parse(data)['id'] == MENTAL_COMMAND_ACTIVE_ACTION_ID) {
            if (data.indexOf('error') === -1) {
              let parsed: getCommandResponse = JSON.parse(data);
              resolve(parsed.result);
            }
          }
        } catch (error) {
          reject('mental command active action error');
        }
      };
    });
  };
  /**
   * This method is to set the active action for the mental command detection.
   * If the status is "set", then the result is an object with "action" and "message" as fields.
   * @param authToken - The auth token
   * @param sessionId - The session id
   * @param profile - The profile you would like to set the sensitivity for.
   * @param action - The 4 different commands to activate
   * @returns - A success message  from the Emotiv API.
   */
  public setMentalCommandActiveActionRequest = (
    authToken: string,
    sessionId: string,
    profile: string,
    action: string[]
  ) => {
    const MENTAL_COMMAND_ACTIVE_ACTION_ID = 12;
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
            console.log(data);
            resolve(data);
          }
        } catch (error) {
          reject('mental command active action error');
        }
      };
    });
  };
  /**
   * Checks if ths application has access to the Emotiv App.
   *
   * @returns true if it has access and rejects an error message if not.
   */
  public hasAccess = async (): Promise<boolean> => {
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
          let accessQuery: RequestAccessResponse = JSON.parse(data);
          if (accessQuery.id == REQUEST_ACCESS_ID) {
            resolve(accessQuery.result.accessGranted);
          }
        } catch (error) {
          reject(new CortexError(3, error));
        }
      };
    });
  };

  /**
   * Sets the profile of the headset.
   *
   * @param authToken The cortex token
   * @param headsetId The headset id
   * @param profileName The profile name you want to set
   * @param status The status
   *
   * @returns a response object from the Emotiv API.
   */
  public setupProfile = async (
    authToken: string,
    headsetId: string,
    profileName: string,
    status: string
  ): Promise<string> => {
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

    return new Promise<string>((resolve, reject) => {
      this._socket.send(JSON.stringify(setupProfileRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          if (data.indexOf('error') !== -1) {
            reject(new CortexError(8, data));
          } else {
            let setupQuery: SetupProfileObject = JSON.parse(data);

            if (data.indexOf('error') === -1) {
              if (setupQuery.result.action == status) {
                resolve(data);
              }
            }
          }
        } catch (error) {
          console.log(error);
          reject(new CortexError(2, error));
        }
      };
    });
  };

  /**
   * Sets the profile of the headset.
   *
   * @param authToken The cortex token
   * @param headsetId The headset id
   * @param profileName The profile name you want to set
   * @param status The status
   *
   * @returns true if there was a loaded profile and false if not.
   */
  public hasCurrentProfile = async (
    authToken: string,
    headsetId: string
  ): Promise<boolean> => {
    let hasCurrentProfileRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: 'getCurrentProfile',
      params: {
        cortexToken: authToken,
        headset: headsetId,
      },
    };

    return new Promise<boolean>((resolve, reject) => {
      this._socket.send(JSON.stringify(hasCurrentProfileRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          let currentProfileResponse: GetCurrentProfileResponse = JSON.parse(
            data
          );
          if (currentProfileResponse.result.name == null) {
            resolve(false);
          } else {
            resolve(true);
          }
        } catch (error) {
          reject(new CortexError(2, error));
        }
      };
    });
  };

  /**
   * Gets the currently loaded profile.
   *
   * @param authToken The cortex token.
   * @param headsetId The headset id.
   *
   * @returns an response object with the currently used profile.
   */
  public getCurrentProfile = async (
    authToken: string,
    headsetId: string
  ): Promise<string> => {
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
          if (data.indexOf('error') === -1) {
            let parsed: GetCurrentProfileResponse = JSON.parse(data);
            resolve(parsed.result.name);
          }
        } catch (error) {
          reject(new CortexError(2, error));
        }
      };
    });
  };
  /**
   *Sets the sensitivity for the mental commands.
   * @param authToken The auth token
   * @param profile The profile you would like to set the sensitivity for
   * @param sessionId The session id
   * @param values The sensitivity values.
   */
  public setSensitivity = async (
    authToken: string,
    profile: string,
    sessionId: string,
    values: number[]
  ) => {
    let currentProfileRequest = {
      id: 16,
      jsonrpc: '2.0',
      method: 'mentalCommandActionSensitivity',
      params: {
        cortexToken: authToken,
        profile: profile,
        session: sessionId,
        status: 'set',
        values: values,
      },
    };
    return new Promise<string>((resolve) => {
      this._socket.send(JSON.stringify(currentProfileRequest));
      this._socket.onmessage = async ({ data }: MessageEvent) => {
        try {
          console.log('set sensitivity:  ' + values + ' \n' + 'data: ' + data);
          resolve(data);
        } catch (error) {
          console.log(error);
        }
      };
    });
  };

  /**
   * Sets the onmessage events for com stream.
   */
  public setComStreamOnmessageEvent = () => {
    this._socket.onmessage = ({ data }: MessageEvent) => {
      try {
        if (JSON.stringify(data).indexOf('jsonrpc') === -1) {
          let parsed: ComDataSample = JSON.parse(data);
          this.notify(parsed);
        }
      } catch (error) {
        console.error('Sub request error');
      }
    };
  };

  /**
   * Sets the onmessage events for fac stream.
   */
  public setFacStreamOnmessageEvent = () => {
    this._socket.onmessage = ({ data }: MessageEvent) => {
      try {
        if (JSON.stringify(data).indexOf('jsonrpc') === -1) {
          let parsed: FacDataSample = JSON.parse(data);
          this.notify(parsed);
        }
      } catch (error) {
        console.error('Fac request error: ' + error);
      }
    };
  };

  /**
   * Retrieves the sensitivity for the mental commands.
   * @param authToken The auth token
   * @param profile The profile you would like to get the sensitivity for.
   * @returns An array of 4 sensitivity values.
   */
  public getSensitivity = async (
    authToken: string,
    profile: string
  ): Promise<number[]> => {
    let getSensitivityRequest = {
      id: 17,
      jsonrpc: '2.0',
      method: 'mentalCommandActionSensitivity',
      params: {
        cortexToken: authToken,
        profile: profile,
        status: 'get',
      },
    };
    return new Promise<number[]>((resolve, reject) => {
      this._socket.send(JSON.stringify(getSensitivityRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          if (data.indexOf('error') === -1) {
            console.log('get sensitivity: ' + data);
            let parsed: getSensitivityResponse = JSON.parse(data);

            if (parsed.id == 17) {
              resolve(parsed.result);
            }
          }
        } catch (error) {
          reject(new CortexError(2, error));
        }
      };
    });
  };
  /**
   * Updates the selected profile and saves it.
   * @param authToken The auth token
   * @param headsetId The headset id
   * @param profile The profile you would like to update
   * @returns A success message
   */
  public saveProfile = async (
    authToken: string,
    headsetId: string,
    profile: string
  ): Promise<number[]> => {
    let saveProfileRequest = {
      id: 18,
      jsonrpc: '2.0',
      method: 'setupProfile',
      params: {
        cortexToken: authToken,
        headset: headsetId,
        profile: profile,
        status: 'save',
      },
    };
    console.log('save profile called');
    return new Promise<number[]>((resolve, reject) => {
      this._socket.send(JSON.stringify(saveProfileRequest));
      this._socket.onmessage = ({ data }: MessageEvent) => {
        try {
          console.log('Save profile: ' + data);
          if (data.indexOf('error') === -1) {
            resolve(data);
          }
        } catch (error) {
          reject(new CortexError(2, error));
        }
      };
    });
  };

  /**
   * Queries all the profiles saved on this user.
   *
   * @param authToken The cortex token
   *
   * @returns an array of strings with all the names of the profiles.
   */
  public queryProfileRequest = async (authToken: string) => {
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
          let profileQuery: QueryProfileResponse = JSON.parse(data);
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

  /**
   * Subscribes to the stream.
   * @param observer The observer
   */
  public async subscribe(observer: IObserver) {
    this.observers.push(observer);
  }

  /**
   * Unsubscribes to the stream.
   * @param observer the observer to remove
   */

  public unsubscribe(observer: IObserver) {
    let observerToRemove = observer;
    console.log('NR observers before unsubscribe: ' + this.observers.length);

    this.observers = [];
    this.observers.filter((item) => item !== observerToRemove);
    console.log('NR observers after unsubscribe: ' + this.observers.length);
  }

  /**
   * Notifies all the listeners.
   * @param streamCommand The command from the stream.
   */
  private notify(streamCommand: FacDataSample | ComDataSample) {
    this.observers.forEach((observer) => observer.sendCommand(streamCommand));
  }
}

interface IObserver {
  sendCommand(command: FacDataSample | ComDataSample): void;
}

export { CortexDriver, StreamObserver, IObserver };
