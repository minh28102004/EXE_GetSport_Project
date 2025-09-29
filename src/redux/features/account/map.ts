import type { AccountDto, Account } from "./type";

export const mapDtoToUi = (d: AccountDto): Account => ({
  id: d.userId,
  role: d.role,
  fullName: d.fullname,
  gender: d.gender,
  phoneNumber: d.phonenumber,
  email: d.email,
  dateOfBirth: d.dateofbirth,
  skillLevel: d.skilllevel,
  membershipType: d.membershiptype,
  totalPoint: d.totalpoint,
  createdAt: d.createat,
  isActive: d.isactive,
  status: d.status,
  walletBalance: Number(d.walletBalance ?? 0),
});
