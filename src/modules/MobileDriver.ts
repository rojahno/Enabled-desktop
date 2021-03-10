import { CortexDriver, IObserver, StreamObserver } from './CortexDriver';

const CONNECTION_RETRY_INTERVAL = 5000; // in ms
const CONNECTION_RETRY_MAX_COUNT = 60; // 60 times to retry x 5s = 5min of total retries

class MobileDriver implements IObserver {
  private _socket!: WebSocket;
  private static instance: MobileDriver;
  private _retryCount: number = 0;
  private ipAdress: string = '';
  private currentTime: number = 0;
  private commandInterval: number = 1500;
  private previousTriggerTime: number = 0;
  public observer!: StreamObserver;

  private constructor() {}

  sendCommand(command: string): void {
    console.log('The command: ' + command);
    this.currentTime = Date.now();
    if (this.currentTime - this.previousTriggerTime >= this.commandInterval) {
      this.sendSomething(command);
    }
  }

  static getInstance(): MobileDriver {
    if (MobileDriver.instance) {
      return MobileDriver.instance;
    }
    MobileDriver.instance = new MobileDriver();
    return MobileDriver.instance;
  }

  public startSocket(ipAdress: string) {
    this.setip(ipAdress);
    this.connect();
  }

  public get socket() {
    return this._socket;
  }

  public setip(ipAdress: string) {
    this.ipAdress = ipAdress;
  }

  /**
   * Creates a connection to the websocket and sets the events.
   * @todo implements start stream logic when facade is ready.
   */
  private connect = () => {
    this._socket = new WebSocket('ws://' + this.ipAdress + ':9000');

    this.socket.onopen = async () => {
      console.log('WS OPENED ✅');

      // reset the total retries
      this._retryCount = 0;
      await this.startCortexStream();
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

      // Reconnects if canRetry is true
      if (this._retryCount < CONNECTION_RETRY_MAX_COUNT) {
        setTimeout(this.reconnect, CONNECTION_RETRY_INTERVAL);
      } else {
        // we passed the threshold for retries, let's abort
        this.unsubscribeToCortexStream();
        this._retryCount = 0;
      }
    };
  };

  /**
   * Makes an attempt to reconect to the server.
   **/
  private reconnect = () => {
    this._retryCount++;
    this.connect();
  };

  startCortexStream = async () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    driver.subscribe(this);
    let authoken: string = await driver.authorize();
    let headsetId: string = await driver.queryHeadsetId();
    let sessionId = await driver.createSession(authoken, headsetId);
    driver.startStream(authoken, sessionId);
  };

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  unsubscribeToCortexStream = () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    driver.unsubscribe(this);
    driver.stopStream();
  };

  closeSocket() {
    this.socket.onclose = (_error) => {
      this.unsubscribeToCortexStream();
      console.log('closing stream');
    };
    this._socket.close();
  }
  /**
   * Checks if we can reconnect or we have reaches our maximun amount of tries.
   **/
  private canRetry(): boolean {
    return this._retryCount > 0;
  }

  sendSomething = async (text: string) => {
    let command: string = '';
    let state: number = this.getRandomInt(4) + 1;
    switch (state) {
      case 1:
        command = 'right';
        this.previousTriggerTime = this.currentTime;
        break;

      case 2:
        command = 'left';
        this.previousTriggerTime = this.currentTime;
        break;

      case 3:
        command = 'push';
        this.previousTriggerTime = this.currentTime;
        break;

      case 4:
        command = 'pull';
        this.previousTriggerTime = this.currentTime;
        break;

      default:
        {
          command = 'neutral';
          this.previousTriggerTime = this.currentTime;
        }
        break;
    }
    this._socket.send(command);
  };
}

export { MobileDriver };
