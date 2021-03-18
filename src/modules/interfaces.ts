interface RequestAccessResponse {
  id: number;
  jsonrpc: string;
  result: RequestAccessResult;
}

interface RequestAccessResult {
  accessGranted: boolean;
  message: string;
}

interface SetupProfileObject {
  id: number;
  jsonrpc: string;
  result: SetupProfileResult;
}
interface SetupProfileResult {
  action: string;
  message: string;
  name: string;
}

interface QueryHeadsetIdResponse {
  id: number;
  jsonrpc: string;
  result: Array<QueryHeadsetIdResult>;
}
interface QueryHeadsetIdResult {
  connectedBy: string;
  customName: string;
  dongle: string;
  firmware: string;
  id: string;
  motionSensors: Array<string>;

  sensors: Array<string>;
  settings: {
    eegRate: number;
    eegRes: number;
    memsRate: number;
    memsRes: number;
    mode: number;
  };
  status: string;
}
interface getSensitivityResponse{

    id: number;
    jsonrpc: string;
    result: number[];

}
interface getCommandResponse{
  id: number;
  jsonrpc: string;
  result: string[  ]
}

interface QueryProfileResponse {
  id: number;
  jsonrpc: string;
  result: Array<QueryProfileResult>;
}
interface QueryProfileResult {
  name: string;
}

interface ControlDeviceResponse {
  id: number;
  jsonrpc: string;
  result: {
    command: string;
    message: string;
  };
}

interface AuthorizeResponse {
  id: number;
  jsonrpc: string;
  result: {
    cortexToken: string;
    warning: {
      code: number;
      message: string;
      licenseUrl: string;
    };
  };
}

interface CreateSessionResponse {
  id: number;
  jsonrpc: string;
  result: {
    id: string;
  };
}

interface GetCurrentProfileResponse {
  id: number,
  jsonrpc: string,
  result: {
    name: string;
    loadedByThisApp: boolean,
  };
}

interface DataSample{
  com:[command:string],
  sid:string,
  time:number
}
interface Warning{
  jsonrpc:string,
  warning:{
    code:number,
    message:any
  }
}

export {
  RequestAccessResponse,
  RequestAccessResult,
  SetupProfileObject,
  SetupProfileResult,
  QueryHeadsetIdResponse,
  QueryHeadsetIdResult,
  QueryProfileResponse,
  QueryProfileResult,
  ControlDeviceResponse,
  AuthorizeResponse,
  CreateSessionResponse,
  GetCurrentProfileResponse,
  DataSample,
  Warning,
  getSensitivityResponse,
  getCommandResponse,
};
