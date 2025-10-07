// src/redux/features/auth/type.ts
export type ApiEnvelope<T> = {
  statusCode: number;
  status: string;
  message: string;
  errors: unknown | null;
  data: T;
};

export type LoginBody = { email: string; password: string };

// RegisterBody chỉ còn 4 field, đều REQUIRED
export type RegisterBody = {
  fullname: string;
  email: string;
  password: string;
  role: string; // hoặc: "Staff" | "Admin" | "Customer" 
};

export type AuthData = {
  token: string;
  fullname: string;
  email: string;
  role: string;
};

