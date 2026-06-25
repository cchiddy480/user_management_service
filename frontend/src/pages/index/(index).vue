// This is the main page of the application, which allows users to connect to a WebSocket server and load a list of users. 
// It displays the connection status and the list of users retrieved from the server.
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
        <div> Status: {{ usersMessage }}</div>
        <q-input v-model="newUserName" label="New User Name" />
        <q-input v-model="newUserEmail" label="New User Email" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Load Users" :loading="isLoadingUsers" @click="loadUsers" />
        <q-btn color="secondary" label="Create User" @click="createUser" />
      </q-card-actions>
     </q-card> 
  </q-page>
</template>

// The script section sets up the reactive state and functions for 
// managing the WebSocket connection and user list.
<script setup lang="ts">
import { ref } from "vue";

const connectionStatus = ref("Disconnected");
const isLoadingUsers = ref(false);
const socket = ref<WebSocket | null>(null);
const webSocketUrl = "ws://localhost:8765"; 
const users = ref<string[]>([]);
const usersMessage = ref("No users loaded yet");
const newUserName = ref("");
const newUserEmail = ref("");

// The connect function establishes a WebSocket connection to the server and 
// sets up event handlers for connection events and incoming messages.
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
    socket.value = null;
  };

  ws.onerror = () => {
    connectionStatus.value = "Error";
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);

    if (Array.isArray(response.users)) {
      users.value = response.users;
      usersMessage.value = users.value.length > 0 ? users.value.join(", ") : "No users found";
    }

    else if (response.id) {
      usersMessage.value = `User created with ID: ${response.id}`;
    }

    else {
      usersMessage.value = response.message || "Unknown response format";
    }
  }
}

// The disconnect function closes the WebSocket connection and updates the connection status.
function disconnect() {
  connectionStatus.value = "Disconnected";
  if (socket.value) {
    socket.value.close();
    socket.value = null;
  }
}

// The loadUsers function sends a request to the server to retrieve the list of users.
function loadUsers() {
  if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
    console.error("WebSocket is not connected.");
    return;
  }

  const payload = {operation: "list_users"};
  socket.value.send(JSON.stringify(payload));
}

// The validateCreateUser function checks if the new user name and email are valid, 
// returning an array of error messages if any validation fails.
function validateCreateUser(): string[] {
  const errors: string[] = [];

  if (!newUserName.value.trim()) {
    errors.push("Name is required.");
  }

  if (!newUserEmail.value.trim()) {
    errors.push("Email is required.");
  } else if (!newUserEmail.value.includes("@")) {
    errors.push("Email must contain @.");
  }

  return errors;
}

// The createUser function sends a request to the server to create a new user with the specified name and email,
// after validating the input fields. It also updates the usersMessage to reflect the operation status.
function createUser() {
  if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
    usersMessage.value = "WebSocket is not connected.";
    return; 
  }

  const errors = validateCreateUser();
  if (errors.length > 0) {
    usersMessage.value = errors.join(" ");
    return;
  }

  const payload = {
    operation: "create_user",
    data: {
      name: newUserName.value,
      email: newUserEmail.value
    }
  };
  socket.value.send(JSON.stringify(payload));
  usersMessage.value = "Creating user...";

}
</script>

