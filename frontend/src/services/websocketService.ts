type MessageHandler = (event: MessageEvent) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandler: MessageHandler | null = null;

  connect(url: string) {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return this.socket;
    }

    const ws = new WebSocket(url);
    this.socket = ws;

    ws.onmessage = (event) => {
      if (this.messageHandler) this.messageHandler(event);
    };

    ws.onclose = () => {
      this.socket = null;
    };

    return ws;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(payload: unknown) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected.");
    }
    this.socket.send(JSON.stringify(payload));
  }

  onMessage(handler: MessageHandler) {
    this.messageHandler = handler;
  }

  getReadyState() {
    return this.socket?.readyState ?? WebSocket.CLOSED;
  }
}

export const websocketService = new WebSocketService();