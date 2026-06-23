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
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";

const connectionStatus = ref("Disconnected");

function connect() {
  connectionStatus.value = "Connected";
}

function disconnect() {
  connectionStatus.value = "Disconnected";
}
</script>
