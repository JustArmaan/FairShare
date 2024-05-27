import { Socket } from 'socket.io';

export class WebsocketManager {
  private static clients = new Map<string, Socket>();

  public static addConnection(id: string, ws: Socket) {
    this.clients.set(id, ws);
    this.setupConnection(id, ws);
  }

  public static broadcast(message: string, excludeId?: string) {
    this.clients.forEach((ws, id) => {
      if (excludeId && excludeId === id) return;
      ws.send(message);
    });
  }

  private static setupConnection(id: string, ws: Socket) {
    ws.on('error', (error) => console.log(error));
    ws.on('close', () => this.clients.delete(id));
  }
}
