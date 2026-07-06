// This is the main page of the application, which allows users to connect to a WebSocket server and load a list of users. 
// It displays the connection status and the list of users retrieved from the server.
<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="page-container column q-gutter-md">
      <q-card flat bordered>
        <q-card-section class="row items-center justify-between q-pb-sm">
          <div>
            <div class="text-h6">Connection</div>
            <div class="text-caption text-grey-7">Manage websocket status</div>
          </div>
          <q-badge
            rounded
            :color="userStore.connectionStatus === 'Connected' ? 'positive' : userStore.connectionStatus === 'Connecting' ? 'warning' : userStore.connectionStatus === 'Error' ? 'negative' : 'grey-7'"
            :label="userStore.connectionStatus"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-gutter-sm q-pt-none">
          <q-btn color="primary" label="Connect" @click="connect" />
          <q-btn color="negative" flat label="Disconnect" @click="disconnect" />
        </q-card-actions>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">Create User</div>
          <div v-if="createStatus" class="text-caption text-grey-7 q-mb-sm">{{ createStatus }}</div>
          <q-input v-model="userStore.newUserName" outlined dense label="New User Name" class="q-mb-sm" />
          <q-input v-model="userStore.newUserEmail" outlined dense label="New User Email" class="q-mb-sm" />
        </q-card-section>

        <q-card-actions align="right" class="q-gutter-sm">
          <q-btn color="secondary" label="Create User" @click="createUser" />
          <q-btn flat color="grey-8" label="User Details" to="/second" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

// The script section sets up the reactive state and functions for 
// managing the WebSocket connection and user list.
<script setup lang="ts">
import { computed } from "vue";
import { websocketService } from "@/services/websocketService";
import type {
  CreateUserRequest
} from "@/models/messages";
import { useUserStore } from "@/stores/user-store";

const userStore = useUserStore();
const webSocketUrl = "ws://localhost:8765"; 
const createStatus = computed(() => {
  const message = userStore.usersMessage;
  const lower = message.toLowerCase();

  if (
    lower.includes("create") ||
    lower.includes("name is required") ||
    lower.includes("email is required") ||
    lower.includes("email must contain")
  ) {
    return message;
  }

  return "";
});

// The connect function establishes a WebSocket connection to the server and 
// sets up event handlers for connection events and incoming messages.
function connect() {
  userStore.connect(webSocketUrl);
}

function disconnect() {
  userStore.disconnect();
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

</script>

<style scoped>
.page-container {
  max-width: 760px;
  margin: 0 auto;
}
</style>

