class MobileDriver {
  private _socket: WebSocket;

  constructor() {
      //The phone server only supports unsecure connections.
    this._socket = new WebSocket('ws://192.168.86.27:9000');
  }

  public get socket() {
    return this._socket;
  }

   getRandomInt(max:number) {
    return Math.floor(Math.random() * Math.floor(max));
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
