import { CortexDriver, IObserver, StreamObserver } from './CortexDriver';
import { ComDataSample, FacDataSample } from './interfaces';

const CONNECTION_RETRY_INTERVAL = 5000; // in ms
const CONNECTION_RETRY_MAX_COUNT = 12; // 12 times to retry x 5s = 1min of total retries
/** 
 * @class
 * The class connects to a Websockets server and sends the commands it recieves to it.
 */
class MobileDriver implements IObserver {
  private _socket!: WebSocket;
  private static instance: MobileDriver;
  private retryCount: number = 0;
  private ipAdress: string = '';
  private currentTime: number = 0;
  private commandInterval: number = 1500;
  private previousTriggerTime: number = 0;
  public observer!: StreamObserver;

  /**
   * Sends a command to the websocket server
   * @param command The command beeing sent.Either a fac command or a com command.
   */
  sendCommand(command: FacDataSample | ComDataSample): void {
    if (this.isConnected()) {
      this.currentTime = Date.now();
      if (this.currentTime - this.previousTriggerTime >= this.commandInterval) {
        if ('com' in command) {
          console.log('Mental stream command sent: ' + command.com[0]);
          this.sendMentalCommand(command.com[0]);
        } else if ('fac' in command) {
          let facCommand: string = this.lookForFacCommand(command);
          console.log('Mental stream command sent: ' + facCommand);
          this.sendFacialExpression(facCommand);
        }
      }
    }
  }

  /**
   * Checks the fac object for other strings than "neutral".
   * @returns The fac command
   */
  lookForFacCommand = (command: FacDataSample) => {
    if (command.fac[0] !== 'neutral') {
      return command.fac[0];
    } else if (command.fac[1] !== 'neutral') {
      return command.fac[1];
    } else if (command.fac[3] !== 'neutral') {
      return command.fac[3];
    } else {
      return 'neutral';
    }
  };
  static getInstance(): MobileDriver {
    if (MobileDriver.instance) {
      return MobileDriver.instance;
    }
    MobileDriver.instance = new MobileDriver();
    return MobileDriver.instance;
  }
  /**
   * Starts the socket.
   * @param ipAdress The Websocket server ip adress
   */
  public startSocket(ipAdress: string) {
    this.setip(ipAdress);
    this.connect();
  }

  /**
   * Sets the ip adress we would like to connect to.
   * @param ipAdress The websocket servers ip adress.
   */
  public setip(ipAdress: string) {
    this.ipAdress = ipAdress;
  }

  /**
   * Creates a connection to the websocket and sets the events.
   */
  private connect = () => {
    this._socket = new WebSocket('ws://' + this.ipAdress + ':9000');

    this.setupSocketEvents();
  };

  private setupSocketEvents = () => {
    this._socket.onopen = async () => {
      console.log('WS OPENED');

      // Reset the total retries
      this.retryCount = 0;
      this.subscribeToCortexStream();
    };

    this._socket.onerror = (_error) => {
      console.log('An socket error has occured. Check connection');
      if (!this.canRetry()) {
      }
    };

    this._socket.onclose = (_error) => {
      if (!this.canRetry()) {
        console.log('Closing');
      }

      if (this.retryCount < CONNECTION_RETRY_MAX_COUNT) {
        setTimeout(this.reconnect, CONNECTION_RETRY_INTERVAL);
      } else {
        // we passed the threshold for retries, let's abort
        this.unsubscribeToCortexStream();
        this.retryCount = 0;
      }
    };
  };
  /**
   * Waits for the socket to open.
   * @param ipAdress the ip adress of the Websocket server
   * @returns true if it connects or false if it reaches the timeout.
   */
  public awaitSocketOpening = async (ipAdress: string) => {
    this.setip(ipAdress);
    this._socket = new WebSocket('ws://' + this.ipAdress + ':9000');

    console.log('Connecting to: ' + ipAdress);
    return new Promise<boolean>((resolve) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve(false);
      }, 5000);

      this._socket.onopen = async () => {
        this.retryCount = 0;
        try {
          this.subscribeToCortexStream();
          this.setupSocketEvents();
          resolve(true);
        } catch (error) {
          console.log(
            'An error occured while trying to connect to the socket server.'
          );
        }
      };
    });
  };

  /**
   * Makes an attempt to reconect to the server.
   **/
  private reconnect = () => {
    this.retryCount++;
    this.connect();
  };

  /**
   * Checks if the socket status is open
   * @returns true if open.
   */
  public isConnected = (): boolean => {
    return this.getStatus() === 'OPEN';
  };

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
  /**
   * Subscribes to the cortex stream
   */
  subscribeToCortexStream = () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    driver.subscribe(this);
  };

  /**
   * Unsubscribes to the cortex stream
   */
  unsubscribeToCortexStream = () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    driver.unsubscribe(this);
  };
  /**
   * Closes the socket and unsubscribes to the stream.
   */
  closeSocket() {
    this.retryCount = CONNECTION_RETRY_MAX_COUNT +1;
    this._socket.close();
  }
  /**
   * Checks if we can reconnect or if we have reaches our maximun amount of tries.
   **/
  private canRetry(): boolean {
    return this.retryCount > 0;
  }

  /**
   * Sends a mental command to the server.
   * @param text The command to send
   */
  sendMentalCommand = async (text: string) => {
    if (this._socket.OPEN === 1) {
      let command: string = '';
      let state = text;
      switch (state) {
        case 'right':
          command = 'right';
          this.previousTriggerTime = this.currentTime;
          break;

        case 'left':
          command = 'left';
          this.previousTriggerTime = this.currentTime;
          break;

        case 'push':
          command = 'push';
          this.previousTriggerTime = this.currentTime;
          break;

        case 'pull':
          command = 'pull';
          this.previousTriggerTime = this.currentTime;
          break;

        default:
          {
            command = 'neutral';
          }
          break;
      }
      let facialExpression = {
        streamType: 'com',
        command: command,
      };

      let stringCommand = JSON.stringify(facialExpression);

      this._socket.send(stringCommand);
    }
  };
  /**
   * Sends a facial expression command to the server.
   * @param text The command to send
   */
  sendFacialExpression = async (command: string) => {
    if (command !== 'neutral') {
      console.log('----------------------');
      console.log(command);
    }

    if (this._socket.OPEN === 1) {
      let state = command;
      switch (state) {
        case 'smile':
          command = 'smile';
          this.previousTriggerTime = this.currentTime;
          break;

        case 'surprise':
          command = 'raise-brows';
          this.previousTriggerTime = this.currentTime;
          break;

        case 'winkL':
          command = 'winkL';
          this.previousTriggerTime = this.currentTime;
          break;

        case 'winkR':
          command = 'winkR';
          this.previousTriggerTime = this.currentTime;
          break;

        default:
          {
            command = 'neutral';
          }
          break;
      }
      let facialExpression = {
        streamType: 'fac',
        command: command,
      };

      let stringCommand = JSON.stringify(facialExpression);

      this._socket.send(stringCommand);
    }
  };
}

export { MobileDriver };
