import React, { useEffect, useState } from "react";
import type { Account } from "@redux/api/account/type";
import LoadingSpinner from "@components/Loading_Spinner";
import { User, IdCard, Phone, Calendar, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* ===================== Types ===================== */

type Props = {
  user: Account | null; // null = create
  onSave: (
    user: Partial<Account> & { password?: string }
  ) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
};

/* ===================== Defaults ===================== */

const defaultNew: Partial<Account> = {
  fullName: "",
  email: "",
  role: "Customer",
  isActive: true,
  status: "active",
  phoneNumber: "",
  membershipType: "",
  skillLevel: "",
  totalPoint: 0,
  dateOfBirth: "",
  gender: "",
};

/* ===================== Small UI helpers ===================== */

const baseField =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm " +
  "transition-colors duration-150 placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 " +
  "disabled:bg-slate-50 disabled:text-slate-400";

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({
  children,
  htmlFor,
}) => (
  <label
    htmlFor={htmlFor}
    className="text-[12px] font-medium text-slate-600 block"
  >
    {children}
  </label>
);

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="rounded-xl border border-slate-200 p-4">
    <div className="mb-3 flex items-center gap-2 text-slate-900">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600 ring-1 ring-teal-100">
        {icon}
      </span>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

/* ===================== Form ===================== */

const UserForm: React.FC<Props> = ({ user, onSave, onClose, loading }) => {
  const [form, setForm] = useState<Partial<Account> & { password?: string }>(
    user ? { ...user } : { ...defaultNew, password: "" }
  );

  useEffect(() => {
    setForm(user ? { ...user } : { ...defaultNew, password: "" });
  }, [user]);

  const setField = <K extends keyof (Account & { password?: string })>(
    key: K,
    value: any
  ) => setForm((s) => ({ ...s, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const isEdit = !!user?.id;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Header + Close */}
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">
          {isEdit ? "Sửa người dùng" : "Thêm người dùng"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Cơ bản */}
      <Section icon={<User className="w-4 h-4" />} title="Thông tin cơ bản">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fullName">Họ và tên</Label>
            <input
              id="fullName"
              className={baseField}
              value={form.fullName ?? ""}
              onChange={(e) => setField("fullName", e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              type="email"
              className={baseField}
              value={form.email ?? ""}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="name@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="role">Vai trò</Label>
            <select
              id="role"
              className={baseField}
              value={form.role ?? "Customer"}
              onChange={(e) => setField("role", e.target.value)}
              disabled={loading}
            >
              <option value="Admin">Admin</option>
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <select
              id="status"
              className={baseField}
              value={(form.status ?? "active") as string}
              onChange={(e) => setField("status", e.target.value)}
              disabled={loading}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="banned">banned</option>
            </select>
          </div>

          {!isEdit && (
            <div className="md:col-span-2">
              <Label htmlFor="password">Mật khẩu (chỉ khi tạo mới)</Label>
              <input
                id="password"
                type="password"
                className={baseField}
                value={form.password ?? ""}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          )}
        </div>
      </Section>

      {/* Liên hệ & hồ sơ */}
      <Section icon={<IdCard className="w-4 h-4" />} title="Liên hệ & hồ sơ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <div className="relative">
              <input
                id="phone"
                className={`${baseField} pr-9`}
                value={form.phoneNumber ?? ""}
                onChange={(e) => setField("phoneNumber", e.target.value)}
                placeholder="VD: 0901234567"
                disabled={loading}
              />
              <Phone className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="dob">Ngày sinh</Label>
            <div className="relative">
              <input
                id="dob"
                type="date"
                className={`${baseField} pr-9`}
                value={(form.dateOfBirth ?? "") as string}
                onChange={(e) => setField("dateOfBirth", e.target.value)}
                disabled={loading}
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="gender">Giới tính</Label>
            <select
              id="gender"
              className={baseField}
              value={form.gender ?? ""}
              onChange={(e) => setField("gender", e.target.value)}
              disabled={loading}
            >
              <option value="">—</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <Label htmlFor="points">Điểm tích luỹ</Label>
            <input
              id="points"
              type="number"
              min={0}
              className={baseField}
              value={Number(form.totalPoint ?? 0)}
              onChange={(e) => setField("totalPoint", Number(e.target.value))}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="memberType">Loại hội viên</Label>
            <input
              id="memberType"
              className={baseField}
              value={form.membershipType ?? ""}
              onChange={(e) => setField("membershipType", e.target.value)}
              placeholder="(Tuỳ chọn)"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="skill">Trình độ</Label>
            <input
              id="skill"
              className={baseField}
              value={form.skillLevel ?? ""}
              onChange={(e) => setField("skillLevel", e.target.value)}
              placeholder="(Tuỳ chọn)"
              disabled={loading}
            />
          </div>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-[#23AEB1] px-4 py-2 text-sm text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-teal-300 disabled:opacity-70"
          disabled={loading}
        >
          {loading && <LoadingSpinner inline color="white" size="4" />}
          {isEdit ? "Lưu thay đổi" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;

/* ===================== Modal Wrapper ===================== */

type ModalProps = Props & { open: boolean };

export const UserFormModal: React.FC<ModalProps> = ({
  open,
  onClose,
  ...formProps
}) => {
  // ESC để đóng
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[100] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          {/* panel */}
          <motion.div
            key="panel"
            initial={{ y: -8, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-[101] w-[92vw] max-w-2xl rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <UserForm {...formProps} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
