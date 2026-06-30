import { defineStore, acceptHMRUpdate } from "pinia";
import { websocketService } from "@/services/websocketService";
import type {
  WebSocketResponse,
  ListUsersRequest,
  DeleteUserRequest
} from "@/models/messages";

type RawUserEntry = string | { id: number | string; name?: string; email?: string };

function toUserString(entry: RawUserEntry): string | null {
  if (typeof entry === "string") {
    return entry;
  }

  const id = Number(entry.id);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const name = (entry.name ?? "").trim();
  const email = (entry.email ?? "").trim();
  return `${id}:${name}:${email}`;
}

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
        const response: WebSocketResponse | RawUserEntry[] = JSON.parse(event.data);

        if (Array.isArray(response)) {
          this.users = response
            .map((entry) => toUserString(entry))
            .filter((entry): entry is string => entry !== null);
          this.usersMessage = this.users.length > 0
            ? `${this.users.length} user${this.users.length === 1 ? "" : "s"} loaded.`
            : "No users found.";
        } else if ("users" in response && Array.isArray(response.users)) {
          this.users = response.users
            .map((entry) => toUserString(entry as RawUserEntry))
            .filter((entry): entry is string => entry !== null);
          this.usersMessage = this.users.length > 0
            ? `${this.users.length} user${this.users.length === 1 ? "" : "s"} loaded.`
            : "No users found.";
        } else if ("id" in response) {
          this.usersMessage = `User created with ID: ${response.id}`;
        } else if ("message" in response) {
          this.usersMessage = response.message;

          if (response.message.toLowerCase().includes("deleted successfully")) {
            this.selectedUser = null;
            this.users = this.users.filter((user) => Number(user.split(":")[0]) !== Number(this.deleteUserId));
            this.deleteUserId = "";
          }

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

    deleteUserById(id: number) {
      if (websocketService.getReadyState() !== WebSocket.OPEN) {
        this.usersMessage = "WebSocket is not connected.";
        return;
      }

      if (!Number.isInteger(id) || id <= 0) {
        this.usersMessage = "Delete User ID must be a positive whole number.";
        return;
      }

      this.deleteUserId = String(id);

      const payload: DeleteUserRequest = {
        operation: "delete_user",
        data: {
          user_id: id
        }
      };

      websocketService.send(payload);
      this.usersMessage = "Deleting user...";
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
