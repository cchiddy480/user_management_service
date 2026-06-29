import { defineStore, acceptHMRUpdate } from "pinia";
import { websocketService } from "@/services/websocketService";
import type { WebSocketResponse, ListUsersRequest } from "@/models/messages";

export const useUserStore = defineStore("user", {
  state: () => ({
    connectionStatus: "Disconnected",
    users: [] as string[],
    usersMessage: "",
    newUserName: "",
    newUserEmail: "",
    deleteUserId: "",
    selectedUser: null as { id: number; name: string; email: string } | null
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

    selectUserById(id: number) { 
      if (this.users.length === 0) { 
        this.selectedUser = null;
        this.usersMessage = "No users loaded. Please load users first.";
        return;
      }

      const found = this.users.find((user) => {
        const [idPart] = user.split(":");
        const userId = Number(idPart);
        return userId === id;
      });

      if (!found) {
        this.selectedUser = null;
        this.usersMessage = `User with ID ${id} not found.`;
        return;
      }

      const [idPart, namePart, emailPart] = found.split(":");
      this.selectedUser = {
        id: Number(idPart),
        name: namePart?.trim() ?? "",
        email: emailPart?.trim() ?? ""
      };

      this.usersMessage = `Loaded user ${id}.`;
    },

    loadUsers() {
      if (websocketService.getReadyState() !== WebSocket.OPEN) {
        this.usersMessage = "WebSocket is not connected.";
        return;
      }

      const payload: ListUsersRequest = { operation: "list_users" };
      websocketService.send(payload);
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
