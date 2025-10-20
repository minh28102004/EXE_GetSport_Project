export type ApiEnvelope<T> = {
  statusCode: number;
  status: string;
  message: string;
  errors: unknown | null;
  data: T;
};

export interface VerifyAccountRequest {
  userId: number;
  token: string;
}

export type LoginBody = { email: string; password: string };

export type RegisterBody = {
  fullname: string;
  email: string;
  password: string;
  role: string; // hoặc: "Staff" | "Admin" | "Customer"
};

export type ForgotPasswordBody = {
  email: string;
};

export type ResetPasswordBody = {
  email: string;
  token: string;
  newPassword: string;
};

export type AuthData = {
  token: string;
  fullname: string;
  email: string;
  role: string;
};