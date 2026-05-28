export type User = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
};

export type ApiErrorField = { field: string; message: string };

export type ApiErrorEnvelope = {
  statusCode: number;
  message: string;
  errors?: ApiErrorField[];
};
