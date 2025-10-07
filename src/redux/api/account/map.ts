import type { AccountDto, Account, CreateAccountDto } from "./type";

/** BE → UI */
export const mapDtoToUi = (d: AccountDto): Account => ({
  id: d.userId,
  role: d.role,
  fullName: d.fullname,
  gender: d.gender ?? null,
  phoneNumber: d.phonenumber ?? null,
  email: d.email,
  dateOfBirth: d.dateofbirth ?? null,
  skillLevel: d.skilllevel ?? null,
  membershipType: d.membershiptype ?? null,
  totalPoint: d.totalpoint ?? 0,
  createdAt: d.createat,
  isActive: d.isactive,
  status: d.status ?? null,
  walletBalance: Number(d.walletBalance ?? 0),
});

/** UI → BE (dùng cho create/update) */
export const mapUiToDto = (
  u: Partial<Account> & { password?: string }
): CreateAccountDto => ({
  role: u.role ?? "user",
  fullname: u.fullName ?? "",
  email: u.email ?? "",
  password: u.password ?? "", // nếu create cần
  gender: u.gender ?? null,
  phonenumber: u.phoneNumber ?? null,
  dateofbirth: u.dateOfBirth ?? null,
  skilllevel: u.skillLevel ?? null,
  membershiptype: u.membershipType ?? null,
  totalpoint: u.totalPoint ?? 0,
  isactive: u.isActive ?? true,
  status: u.status ?? null,
});
