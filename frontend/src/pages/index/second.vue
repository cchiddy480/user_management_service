<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="page-container column q-gutter-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">Users</div>
          <div class="text-caption text-grey-7 q-mb-sm">Load users, view details, and delete from one place</div>
          <q-banner dense rounded class="bg-blue-1 text-blue-10">
            {{ userStore.usersMessage || "No status yet." }}
          </q-banner>
        </q-card-section>

        <q-card-section>
          <q-input v-model="searchUserId" outlined dense label="User ID" />
        </q-card-section>

        <q-card-actions align="right" class="q-gutter-sm">
          <q-btn color="primary" label="Load Users" @click="loadUsers" />
          <q-btn color="secondary" label="Search User" @click="searchUser" />
          <q-btn flat color="grey-8" to="/" label="Back to Index" />
        </q-card-actions>
      </q-card>

      <q-card flat bordered>
        <q-card-section class="q-pb-none">
          <div class="text-subtitle1">Loaded Users</div>
          <div class="text-caption text-grey-7">Click a row to open details</div>
        </q-card-section>
        <q-card-section>
          <q-table
            flat
            dense
            :rows="tableRows"
            :columns="columns"
            row-key="rowKey"
            :pagination="{ rowsPerPage: 8 }"
            @row-click="onRowClick"
          >
            <template v-slot:no-data>
              <div class="text-grey-7 q-pa-sm">No users loaded yet.</div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <q-card v-if="userStore.selectedUser" flat bordered>
        <q-card-section>
          <div class="text-h6">Selected User</div>
          <div class="detail-row"><span>ID</span><strong>{{ userStore.selectedUser.id }}</strong></div>
          <div class="detail-row"><span>Name</span><strong>{{ userStore.selectedUser.name }}</strong></div>
          <div class="detail-row"><span>Email</span><strong>{{ userStore.selectedUser.email }}</strong></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="negative" label="Delete User" @click="deleteSelectedUser" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useUserStore } from "@/stores/user-store";

const userStore = useUserStore();
const searchUserId = ref("");

type UserRow = {
  rowKey: string;
  id: string;
  name: string;
  email: string;
  raw: string;
};

const columns = [
  { name: "id", label: "ID", field: "id", align: "left" as const, sortable: true },
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "email", label: "Email", field: "email", align: "left" as const, sortable: true }
];

function parseUserEntry(user: string, index: number): UserRow {
  const trimmed = user.trim();
  const parts = trimmed.split(":");

  if (parts.length >= 3) {
    const idPart = (parts[0] ?? "").trim();
    const namePart = (parts[1] ?? "").trim();
    return {
      rowKey: `${idPart}-${index}`,
      id: idPart,
      name: namePart,
      email: parts.slice(2).join(":").trim(),
      raw: user
    };
  }

  const idMatch = trimmed.match(/id\s*[:=]\s*(\d+)/i);
  const nameMatch = trimmed.match(/name\s*[:=]\s*([^,]+)/i);
  const emailMatch = trimmed.match(/email\s*[:=]\s*([^,\s]+)/i);

  return {
    rowKey: `raw-${index}`,
    id: idMatch?.[1]?.trim() ?? "-",
    name: nameMatch?.[1]?.trim() ?? "-",
    email: emailMatch?.[1]?.trim() ?? "-",
    raw: user
  };
}

const tableRows = computed<UserRow[]>(() =>
  userStore.users.map((user, index) => parseUserEntry(user, index))
);

watch(tableRows, (rows) => {
  if (rows.length === 0) {
    userStore.selectedUser = null;
    return;
  }

  const currentId = userStore.selectedUser?.id;
  const hasCurrent = rows.some((row) => Number(row.id) === currentId);
  if (hasCurrent) {
    return;
  }

  const firstValid = rows.find((row) => {
    const parsedId = Number(row.id);
    return Number.isInteger(parsedId) && parsedId > 0;
  });

  if (firstValid) {
    userStore.selectUserById(Number(firstValid.id));
  }
}, { immediate: true });

function loadUsers() {
  userStore.loadUsers();
}

function searchUser() {
  if (!searchUserId.value.trim()) {
    userStore.usersMessage = "User ID is required.";
    return;
  }

  const id = Number(searchUserId.value);
  if (!Number.isInteger(id) || id <= 0) {
    userStore.usersMessage = "User ID must be a positive whole number.";
    return;
  }

  userStore.selectUserById(id);
}

function onRowClick(_: Event, row: UserRow) {
  const parsedId = Number(row.id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    userStore.usersMessage = "Could not parse user ID from selected row.";
    return;
  }

  userStore.selectUserById(parsedId);
}

function deleteSelectedUser() {
  if (!userStore.selectedUser) {
    userStore.usersMessage = "No user selected to delete.";
    return;
  }

  userStore.deleteUserById(userStore.selectedUser.id);
}
</script>

<style scoped>
.page-container {
  max-width: 760px;
  margin: 0 auto;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eceff1;
}

.detail-row:last-child {
  border-bottom: 0;
}
</style>
