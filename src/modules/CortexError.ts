class CortexError {
  private errorId: number;
  private cortexMessage: string;

  constructor(errorId: number, cortexMessage: string) {
    this.errorId = errorId;
    this.cortexMessage = cortexMessage;
    
  }

  public get id() {
    return this.errorId;
  }
  public get errMessage() {
    return this.getErrorMessage(this.errorId);
  }
  public get cMessage() {
    return this.cortexMessage;
  }

  private getErrorMessage(errorId: number): string {
    switch (errorId) {
      case 1:
        {
          return 'case 1';
        }
        break;

      case 2:
        {
          return 'Cant find any headset. Please connect a headset to your pc and ' +
          'check if the headseth is connected to the Emotiv app';
        }
        break;

        case 3:
          {
            return 'Access to the Emotiv application was denied';
          }
        break;
        case 4:
          {
            return '';
          }
        break;

      default: {
        return 'undefined error';
      }
    }
  }
}

export default CortexError;
