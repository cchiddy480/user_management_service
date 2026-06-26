// This is the main page of the application, which allows users to connect to a WebSocket server and load a list of users. 
// It displays the connection status and the list of users retrieved from the server.
<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Connection</div>
        <div>Status: {{ userStore.connectionStatus }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Connect" @click="connect" />
        <q-btn color="negative" flat label="Disconnect" @click="disconnect" />
      </q-card-actions>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Users</div>
        <div> Status: {{ userStore.usersMessage }}</div>
        <q-input v-model="userStore.newUserName" label="New User Name" />
        <q-input v-model="userStore.newUserEmail" label="New User Email" />
        <q-input v-model="userStore.deleteUserId" label="Delete User ID" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Load Users" :loading="isLoadingUsers" @click="loadUsers" />
        <q-btn color="secondary" label="Create User" @click="createUser" />
        <q-btn color="negative" label="Delete User" @click="deleteUser" />
      </q-card-actions>
     </q-card> 
  </q-page>
</template>

// The script section sets up the reactive state and functions for 
// managing the WebSocket connection and user list.
<script setup lang="ts">
import { ref } from "vue";
import { websocketService } from "@/services/websocketService";
import type {
  WebSocketResponse,
  ListUsersRequest,
  CreateUserRequest,
  DeleteUserRequest
} from "@/models/messages";
import { useUserStore } from "@/stores/user-store";

const userStore = useUserStore();
const isLoadingUsers = ref(false);
const webSocketUrl = "ws://localhost:8765"; 

// The connect function establishes a WebSocket connection to the server and 
// sets up event handlers for connection events and incoming messages.
function connect() {
  userStore.connect(webSocketUrl);
}

function disconnect() {
  userStore.disconnect();
}

// The loadUsers function sends a request to the server to retrieve the list of users.
function loadUsers() {
  if (websocketService.getReadyState() !== WebSocket.OPEN) {
    console.error("WebSocket is not connected.");
    return;
  }

  const payload: ListUsersRequest = { operation: "list_users" };
  websocketService.send(payload);
}

// The validateCreateUser function checks the input fields for creating a new user 
// and returns an array of error messages if any validation fails.
function validateCreateUser(): string[] {
  const errors: string[] = [];

  if (!userStore.newUserName.trim()) {
    errors.push("Name is required.");
  }

  if (!userStore.newUserEmail.trim()) {
    errors.push("Email is required.");
  } else if (!userStore.newUserEmail.includes("@")) {
    errors.push("Email must contain @.");
  }

  return errors;
}

// The createUser function sends a request to the server to create a new user with the specified name and email,
// after validating the input fields. It also updates the usersMessage to reflect the operation status.
function createUser() {
  if (websocketService.getReadyState() !== WebSocket.OPEN) {
    userStore.usersMessage = "WebSocket is not connected.";
    return; 
  }

  const errors = validateCreateUser();
  if (errors.length > 0) {
    userStore.usersMessage = errors.join(" ");
    return;
  }

  const payload: CreateUserRequest = {
    operation: "create_user",
    data: {
      name: userStore.newUserName,
      email: userStore.newUserEmail
    }
  };
  websocketService.send(payload);
  userStore.usersMessage = "Creating user...";
}

// The deleteUser function sends a request to the server to delete a user with the specified ID,
// after validating the input field. It also updates the usersMessage to reflect the operation status.
function deleteUser() {
  if (websocketService.getReadyState() !== WebSocket.OPEN) {
    userStore.usersMessage = "WebSocket is not connected.";
    return;
  }

  if (!userStore.deleteUserId.trim()) {
    userStore.usersMessage = "Delete User ID is required.";
    return;
  }

  const id = Number(userStore.deleteUserId);
  if (!Number.isInteger(id) || id <= 0) {
    userStore.usersMessage = "Delete User ID must be a positive whole number.";
    return;
  }

  const payload: DeleteUserRequest = { 
    operation: "delete_user",
    data: {
      user_id: id
    }
  }

  websocketService.send(payload);
  userStore.usersMessage = "Deleting user...";
}
</script>

