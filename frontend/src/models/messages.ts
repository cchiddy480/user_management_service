// This file contains TypeScript interfaces for WebSocket requests and responses used in the frontend application.

export interface ListUsersRequest {
  operation: "list_users";
}

export interface CreateUserRequest {
  operation: "create_user";
  data: {
    name: string;
    email: string;
  };
}

export interface DeleteUserRequest {
  operation: "delete_user";
  data: {
    user_id: number;
  };
}

export type WebSocketRequest =
  | ListUsersRequest
  | CreateUserRequest
  | DeleteUserRequest;

export interface ListUsersResponse {
  users: string[];
}

export interface CreateUserResponse {
  id: number;
}

export interface MessageResponse {
  message: string;
}

export type WebSocketResponse =
  | ListUsersResponse
  | CreateUserResponse
  | MessageResponse;