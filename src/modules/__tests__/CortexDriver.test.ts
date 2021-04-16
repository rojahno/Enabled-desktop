import WS from 'jest-websocket-mock';
import { CortexDriver } from '../CortexDriver';

let server;

describe('Cortex driver test', function () {
  var socket: CortexDriver;

   beforeEach(async  () => {
    // Setup
    server = new WS('wss://localhost:6868', { jsonProtocol: true });
    socket = new CortexDriver();
    await server.connected;
  });

  afterEach( () => {
    WS.clean();
  });

  test('is connected to the server', () => {
    expect(socket.isConnected).toBeTruthy();
  });

});
