import type {
  AuthResponse,
  ChangeNameInput,
  ChangePasswordInput,
  LoginInput,
  SignupInput,
  User,
} from "@tilda/shared";
import { apiClient } from "./client";

export const authApi = {
  signup: (data: SignupInput) =>
    apiClient.post<User>("/auth/signup", data).then((r) => r.data),

  login: (data: LoginInput) =>
    apiClient.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  logout: () => apiClient.post<void>("/auth/logout").then((r) => r.data),

  me: () => apiClient.get<User>("/auth/me").then((r) => r.data),

  updateName: (data: ChangeNameInput) =>
    apiClient.patch<User>("/auth/me", data).then((r) => r.data),

  changePassword: (data: ChangePasswordInput) =>
    apiClient
      .patch<{ ok: true }>("/auth/me/password", data)
      .then((r) => r.data),
};
