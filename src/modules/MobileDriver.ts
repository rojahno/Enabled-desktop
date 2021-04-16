import { CortexDriver, IObserver, StreamObserver } from './CortexDriver';
import { ComDataSample, FacDataSample } from './interfaces';

const CONNECTION_RETRY_INTERVAL = 5000; // in ms
const CONNECTION_RETRY_MAX_COUNT = 60; // 60 times to retry x 5s = 5min of total retries
/**
 * The class connects to a Websockets server and sends the commands it recieves to it.
 */
class MobileDriver implements IObserver {
  private socket!: WebSocket;
  private static instance: MobileDriver;
  private retryCount: number = 0;
  private ipAdress: string = '';
  private currentTime: number = 0;
  private commandInterval: number = 1500;
  private previousTriggerTime: number = 0;
  public observer!: StreamObserver;

  /**
   *
   * @param command sends a command to the websocket server
   */
  sendCommand(command: FacDataSample | ComDataSample): void {
    this.currentTime = Date.now();
    if (this.currentTime - this.previousTriggerTime >= this.commandInterval) {
      if ('com' in command) {
        console.log('Mental stream command sent: ' + command.com[0]);
        this.sendSomething(command.com[0]);
      } else if ('fac' in command) {
        console.log('Faciall stream command sent: ' + command.fac[0]);
        this.previousTriggerTime = this.currentTime;
      }
    }
  }

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
    this.socket = new WebSocket('ws://' + this.ipAdress + ':9000');

    this.setupSocketEvents();
  };

  private setupSocketEvents = () => {
    this.socket.onopen = async () => {
      console.log('WS OPENED ✅');

      // reset the total retries
      this.retryCount = 0;
      this.subscribeToCortexStream();
    };

    this.socket.onerror = (_error) => {
      console.log('An error happened');
      if (!this.canRetry()) {
      }
    };

    this.socket.onclose = (_error) => {
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
    this.socket = new WebSocket('ws://' + this.ipAdress + ':9000');

    console.log('Connecting to: ' + ipAdress);
    return new Promise<boolean>((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve(false);
      }, 5000);

      this.socket.onopen = async () => {
        this.retryCount = 0;
        try {
          this.subscribeToCortexStream();
          this.setupSocketEvents();
          resolve(true);
        } catch (error) {
          console.log('await socket error');
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
   * Subscribes to the cortex stream
   */
  subscribeToCortexStream = () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    driver.subscribe(this);
  };

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

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
    this.socket.onclose = (_error) => {
      this.unsubscribeToCortexStream();
      console.log('closing stream');
    };
    this.socket.close();
  }
  /**
   * Checks if we can reconnect or we have reaches our maximun amount of tries.
   **/
  private canRetry(): boolean {
    return this.retryCount > 0;
  }
/**
 * Sends a command to the server.
 * @param text The command to send
 */
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
    this.socket.send(command);
  };
}

export { MobileDriver };
