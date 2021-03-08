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
          return 'case 2';
        }
        break;

      default: {
        return 'undefined error';
      }
    }
    return 'undefined error';
  }
}
