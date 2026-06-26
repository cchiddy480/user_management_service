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

  getters: {
    
  },

  actions: {
    setConnectionStatus(status: string) {
      this.connectionStatus = status;
    },

    connect(url: string) {
    
    },

    disconnect() {

    }
   
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
