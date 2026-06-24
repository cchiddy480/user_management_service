<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Connection</div>
        <div>Status: {{ connectionStatus }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Connect" @click="connect" />
        <q-btn color="negative" flat label="Disconnect" @click="disconnect" />
      </q-card-actions>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Users</div>
        <div> Status: No users loaded yet</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Load Users" :loading="isLoadingUsers" @click="isLoadingUsers = true" />
      </q-card-actions>
     </q-card> 
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";

const connectionStatus = ref("Disconnected");
const isLoadingUsers = ref(false);
const socket = ref<WebSocket | null>(null);
const webSocketUrl = "ws://localhost:8765"; 

function connect() {
  if (
    socket.value &&
    (socket.value.readyState === WebSocket.OPEN ||
      socket.value.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  connectionStatus.value = "Connecting";

  const ws = new WebSocket(webSocketUrl);
  socket.value = ws;

  ws.onopen = () => {
    connectionStatus.value = "Connected";
  };

  ws.onclose = () => {
    connectionStatus.value = "Disconnected";
  };

  ws.onerror = () => {
    connectionStatus.value = "Error";
  };
}

function disconnect() {
  connectionStatus.value = "Disconnected";
}


</script>

