import io, { Socket as TSocket } from 'socket.io-client';

import { SocketConfig } from './types';
import { promisify } from './utils';

export default class Socket {
  private _host: string;
  private _port: number;
  private _io?: TSocket;

  constructor(config: SocketConfig) {
    this._host = config.host;
    this._port = config.port;
  }

  get connected() {
    return this._io?.connected;
  }

  connect(): Promise<void> {
    this.disconnect();
    const { promise, resolve } = promisify<void>();

    const host = `http://${this._host}:${this._port}`;
    this._io = io(host, {
      timeout: 5000,
      transports: ['websocket'],
    });

    this._io.on('connect', () => resolve());
    this._io.on('reconnect_error', this.disconnect);
    this._io.on('disconnect', this.disconnect);

    return promise;
  }

  disconnect() {
    this._io?.disconnect();
  }

  emit(event: string, data?: object): Promise<any> {
    const { promise, resolve, reject } = promisify<any>();
    if (!this.connected) {
      reject('socket not connected');
    } else {
      this._io?.emit(event, data, (response: any) => resolve(response));
    }
    return promise;
  }

  on(event: string, callback: (arg?: any) => void) {
    this._io?.on(event, callback);
  }
}
