import React from 'react';

import {
  authorize,
  controlDevice,
  createSession,
  getCurrentProfile,
  hasAccess,
  queryHeadsetId,
  queryProfileRequest,
  requestAccess,
  setupProfile,
} from './../modules/CortexDriver';

const webSocket = new WebSocket('wss://localhost:6868');
const user = {
  license: '',
  clientId: '0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV',
  clientSecret:
    'HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ',
  debit: 1,
};

class Main extends React.Component {
  state = {
    hasAccess: false,
    access: 'hey',
    headsetId: '',
    controlId: '',
    cortexToken: '',
    profiles: [],
    errorMsg: '',
    sessionId: '',
    stream: '',
    loadedMsg: 'hello',
    unloadMsg: 'uload',
    thisProfile: '',
  };
  componentDidMount() {
    webSocket.onopen = async () => {
      await this.initCortex();
      console.log('Hello');
    };
  }

  initCortex = async () => {
    try {
      let accessGranted: boolean = await hasAccess(webSocket, user);
      console.log('bool' + accessGranted);
      this.setState({hasAccess: accessGranted });

      if (!accessGranted) {
        let access: string = await requestAccess(webSocket, user);
        this.setState({ access: access });
      }

      const id: string = await queryHeadsetId(webSocket);
      this.setState({ headsetId: id });

      const controlID: string = await controlDevice(
        this.state.headsetId,
        webSocket
      );
      this.setState({ controlId: controlID });

      const token = await authorize(webSocket, user);
      this.setState({ cortexToken: token });

      const sessionId = await createSession(
        webSocket,
        this.state.cortexToken,
        this.state.headsetId
      );
      this.setState({ sessionId: sessionId });

      const currentProfile = await getCurrentProfile(
        webSocket,
        this.state.cortexToken,
        this.state.headsetId
      );
      this.setState({ thisProfile: currentProfile });
    } catch (error) {
      this.setState({ errorMsg: 'check headset and connection' });
    }
  };

  getProfiles = async () => {
    const profiles: string[] = await queryProfileRequest(
      webSocket,
      this.state.cortexToken
    );
    this.setState({ profiles: profiles });
  };

  removeProfiles = () => {
    let profile: string[] = [];
    this.setState({ profiles: profile });
  };
  //For some reason you cant load or unload a profile if you have already loaded a profile
  //from the EmotiveBCI app or another version of the electron desktop app. The best way to deal with
  //this is to restart both the emotive app and the EmotiveBCI.
  loadProfiles = async () => {
    let status: string = 'load';
    let profileName: string = 'D7';
    try {
      await this.unloadProfiles();

      const loaded: string = await setupProfile(
        webSocket,
        this.state.cortexToken,
        this.state.headsetId,
        profileName,
        status
      );
      this.setState({ loadedMsg: loaded });
    } catch (error) {
      this.setState({ errorMsg: 'error' });
    }
  };

  unloadProfiles = async () => {
    let status: string = 'unload';
    let profileName: string = '';
    try {
      const unloaded: string = await setupProfile(
        webSocket,
        this.state.cortexToken,
        this.state.headsetId,
        profileName,
        status
      );
      this.setState({ unloadMsg: unloaded });
    } catch (error) {
      this.setState({ errorMsg: 'error' });
    }
  };

  subscribeToStream = () => {
    const stream: string[] = ['com'];
    let method: string = 'subscribe';
    const subRequest = this.createSubRequest(
      stream,
      this.state.cortexToken,
      this.state.sessionId,
      method
    );

    webSocket.send(JSON.stringify(subRequest));
    webSocket.onmessage = ({ data }: MessageEvent) => {
      try {
        //console.log(data);
        this.setState({ stream: data });
      } catch (error) {
        console.log('don fucked up');
      }
    };
  };

  unsubscribeToStream = () => {
    const stream: string[] = ['com'];
    let method: string = 'unsubscribe';
    const subRequest = this.createSubRequest(
      stream,
      this.state.cortexToken,
      this.state.sessionId,
      method
    );

    webSocket.send(JSON.stringify(subRequest));
    webSocket.onmessage = ({ data }: MessageEvent) => {
      try {
        //console.log(data);
        this.setState({ stream: data });
      } catch (error) {
        console.log('don fucked up');
      }
    };
  };

  createSubRequest = (
    stream: string[],
    authToken: string,
    sessionId: string,
    method: string
  ) => {
    const SUB_REQUEST_ID = 6;
    let subRequest = {
      id: SUB_REQUEST_ID,
      jsonrpc: '2.0',
      method: method,
      params: {
        cortexToken: authToken,
        session: sessionId,
        streams: stream,
      },
    };

    return subRequest;
  };

  render() {
    return (
      <div>
        <div className="Hello">
          {this.state.errorMsg}
          <br />
          <br />
          Headset id: {this.state.headsetId}
          <br />
          <br />
          Control id: {this.state.controlId}
          <br />
          <br />
          Access: {this.state.access}
          <br />
          <br />
          Has access: {this.state.hasAccess.toString()}
          <br />
          <br />
          Stream: {this.state.stream}
          <br />
          {/*{this.state.cortexToken} */}
        </div>
        <br />
        Loaded message: {this.state.loadedMsg}
        <br />
        <br />
        Onload message: {this.state.unloadMsg}
        <br />
        <br />
        Current profile: {this.state.thisProfile}
        <br />
        <br />
        <ul className="profileButtons">
          {this.state.profiles.map((profile: React.ReactNode) => {
            return <button>{profile}</button>;
          })}
        </ul>
        <button
          type={'button'}
          onClick={async () => {
            await this.getProfiles();
          }}
        >
          Profiler
        </button>
        <button onClick={this.removeProfiles}>Fjern profiler!</button>
        <button onClick={this.subscribeToStream}>start streamen</button>
        <button onClick={this.unsubscribeToStream}>stop streamen</button>
        <button onClick={this.loadProfiles}>Load profile</button>
      </div>
    );
  }
}
export default Main;
