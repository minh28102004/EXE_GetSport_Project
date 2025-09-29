import type { ApiEnvelope } from "@redux/features/auth/type";

/** Giữ nguyên key theo BE */
export type AccountDto = {
  userId: number;
  role: string;
  fullname: string;
  gender: string | null;
  phonenumber: string | null;
  email: string;
  dateofbirth: string | null;       // "YYYY-MM-DD"
  skilllevel: string | null;
  membershiptype: string | null;
  totalpoint: number;
  createat: string;                 // ISO datetime
  isactive: boolean;
  status: string | null;
  walletBalance: number;
};

/** Dạng dùng cho UI (camelCase + id) */
export type Account = {
  id: number;
  role: string;
  fullName: string;
  gender?: string | null;
  phoneNumber?: string | null;
  email: string;
  dateOfBirth?: string | null;
  skillLevel?: string | null;
  membershipType?: string | null;
  totalPoint: number;
  createdAt: string;
  isActive: boolean;
  status?: string | null;
  walletBalance: number;
};

/** Body tạo/cập nhật (tuỳ BE yêu cầu) */
export type CreateAccountDto = {
  role: string;
  fullname: string;
  email: string;
  password?: string;
  gender?: string | null;
  phonenumber?: string | null;
  dateofbirth?: string | null;
  skilllevel?: string | null;
  membershiptype?: string | null;
  totalpoint?: number;
  isactive?: boolean;
  status?: string | null;
};
export type UpdateAccountDto = Partial<CreateAccountDto>;

export type ListParams = { page?: number; pageSize?: number; search?: string; sort?: string };
export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };

/** Envelope tiện cho FE */
export type AccountEnvelope = ApiEnvelope<Account>;
export type AccountListEnvelope = ApiEnvelope<Account[] | Paged<Account>>;
