import { defineStore, acceptHMRUpdate } from "pinia";
import { websocketService } from "@/services/websocketService";
import type { WebSocketResponse } from "@/models/messages";

export const useUserStore = defineStore("user", {
  state: () => ({
    connectionStatus: "Disconnected",
    users: [] as string[],
    usersMessage: "",
    newUserName: "",
    newUserEmail: "",
    deleteUserId: ""
  }),

  getters: {},

  actions: {
    setConnectionStatus(status: string) {
      this.connectionStatus = status;
    },

    connect(url: string) {
      if (
        websocketService.getReadyState() === WebSocket.OPEN ||
        websocketService.getReadyState() === WebSocket.CONNECTING
      ) {
        return;
      }

      this.connectionStatus = "Connecting";
      const ws = websocketService.connect(url);

      ws.onopen = () => {
        this.connectionStatus = "Connected";
      };

      ws.onclose = () => {
        this.connectionStatus = "Disconnected";
      };

      ws.onerror = () => {
        this.connectionStatus = "Error";
      };

      websocketService.onMessage((event) => {
        const response: WebSocketResponse = JSON.parse(event.data);
      
        if ("users" in response && Array.isArray(response.users)) {
          this.users = response.users;
          this.usersMessage = this.users.length > 0 ? this.users.join(", ") : "No users found.";
        } else if ("id" in response) {
          this.usersMessage = `User created with ID: ${response.id}`;
        } else if ("message" in response) {
          this.usersMessage = response.message;
        } else {
          this.usersMessage = "Unknown response format";
        }
      });
    },

    disconnect() {
      websocketService.disconnect();
      this.connectionStatus = "Disconnected";
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
