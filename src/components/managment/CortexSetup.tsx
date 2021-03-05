class CortexSetup {
  private _hasAccessToApp: boolean = false;
  private _headsetId: string = '';
  private _controlId: string = '';
  private _cortexToken: string = '';

  constructor(
    hasAccess: boolean,
    headsetId: string,
    controlId: string,
    authToken: string
  ) {
    this._hasAccessToApp = hasAccess;
    this._headsetId = headsetId;
    this._controlId = controlId;
    this._cortexToken = authToken;
  }

  get hasAccess() {
    return this._hasAccessToApp;
  }
  get headsetId() {
    return this._headsetId;
  }
  get controlId() {
    return this._controlId;
  }
  get cortexToken() {
    return this._cortexToken;
  }
}
