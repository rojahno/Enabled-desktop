
const CONNECTION_RETRY_INTERVAL = 5000; // in ms
const CONNECTION_RETRY_MAX_COUNT = 60; // 60 times to retry x 5s = 5min of total retries

class MobileDriver {
  private _socket: WebSocket;
  private static instance: MobileDriver;
  private _retryCount:number = 0;
  private ipAdress:string = "";

  private constructor() {
      //The phone server only supports unsecure connections.
    this._socket = new WebSocket('ws://192.168.86.27:9000');
  }

  static getInstance(): MobileDriver {
    if (MobileDriver.instance) {
      return MobileDriver.instance;
    }
    MobileDriver.instance = new MobileDriver();
    return MobileDriver.instance;
  }

  public get socket() {
    return this._socket;
  }

  public set ip(ipAdress:string){
  this.ipAdress = ipAdress;
  }

  /**
   * Creates a connection to the websocket and sets the events.
   */
  private connect = () => {
    this._socket = new WebSocket('wss://localhost:6868');

    this.socket.onopen = () => {
      console.log('WS OPENED ✅');

      // reset the total retries
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

      // Reconnects if canRetry is true
      if (this._retryCount < CONNECTION_RETRY_MAX_COUNT) {
        setTimeout(this.reconnect, CONNECTION_RETRY_INTERVAL);
      } else {
        // we passed the threshold for retries, let's abort
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

   getRandomInt(max:number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

    /**
   * Checks if we can reconnect or we have reaches our maximun amount of tries.
   **/
  private canRetry(): boolean {
    return this._retryCount > 0;
  }
  

  sendSomething = async (text:string) => {
    setInterval(() => {
        let command:string = "";

        let state: number =  this.getRandomInt(4)+1;
        console.log(state);
        switch(state){
            case 1:
            command = "right";
            break;
           
            case 2:
                command = "left";
            break;

            case 3:
                command = "push";
            break;

            case 4:
                command = "pull";
            break;
        }
        console.log(command);
      this._socket.send("right");
    },1500);
  };
}

export { MobileDriver };
