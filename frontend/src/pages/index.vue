<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Connection</div>
        <div>Status: {{ connectionStatus }}</div>
        <q-card-actions>
          <q-btn
            color="primary"
            label="Connect"
            @click="connectionStatus = 'Connected'"
          />
          <q-btn
            color="negative"
            label="Disconnect"
            @click="connectionStatus = 'Disconnected'"
          />
        </q-card-actions>
      </q-card-section>
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
