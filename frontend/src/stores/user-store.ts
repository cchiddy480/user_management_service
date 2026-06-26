import { defineStore, acceptHMRUpdate } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    connectionStatus: "Disconnected",
    users: [] as string[],
    usersMessage: "",
  }),

  getters: {
    
  },

  actions: {
   
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
