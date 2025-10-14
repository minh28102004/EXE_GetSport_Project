import React, { useEffect, useMemo, useState } from "react";
import {
  User as UserIcon,
  Calendar,
  Star,
  Check,
  CreditCard,
  Edit3,
  Trophy,
  Bell,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading_Spinner";
import {
  useGetUserQuery,
  useUpdateAccountMutation,
} from "@redux/api/account/accountApi";
import { selectToken } from "@redux/features/auth/authSlice";
import { getUserIdFromToken } from "@utils/jwt";

type FormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  skillLevel: string;
  membershipType: string;
};

function fmtMoney(v?: number) {
  try {
    return (v ?? 0).toLocaleString("vi-VN");
  } catch {
    return String(v ?? 0);
  }
}

const Profile: React.FC = () => {
  const token = useSelector(selectToken);
  const userId = useMemo(() => getUserIdFromToken(token), [token]);
  console.log("Extracted userId from token:", userId);  
  const { data, isLoading, isFetching, error, refetch } = useGetUserQuery(userId!, {
    skip: !userId || !token,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [updateAccount, { isLoading: saving }] = useUpdateAccountMutation();

  const account = data?.data;

  const [editMode, setEditMode] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    skillLevel: "",
    membershipType: "",
  });

  // Debugging logs
  useEffect(() => {
    console.log("Profile Debug:", { token, userId, data, error, account });
  }, [token, userId, data, error, account]);

  // Initialize form with account data
  useEffect(() => {
    if (!account) return;
    setForm({
      fullName: account.fullName ?? "Tan Kim",
      email: account.email ?? "kimltce170469@fpt.edu.vn",
      phoneNumber: account.phoneNumber ?? "",
      dateOfBirth: account.dateOfBirth ? new Date(account.dateOfBirth).toISOString().split("T")[0] : "",
      gender: account.gender ?? "",
      skillLevel: account.skillLevel ?? "",
      membershipType: account.membershipType ?? "",
    });
  }, [account]);

  const onChange =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  const completionRate = useMemo(() => {
    const keys: (keyof FormState)[] = [
      "fullName",
      "email",
      "phoneNumber",
      "dateOfBirth",
      "gender",
    ];
    const filled = keys.filter((k) => (form[k] ?? "").toString().trim()).length;
    return Math.round((filled / keys.length) * 100);
  }, [form]);

  const onSave = async () => {
    if (!userId) {
      toast.error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
      return;
    }
    try {
      const body = {
        fullname: form.fullName || null,
        email: form.email || null,
        phonenumber: form.phoneNumber || null,
        dateofbirth: form.dateOfBirth || null,
        gender: form.gender || null,
        skilllevel: form.skillLevel || null,
        membershiptype: form.membershipType || null,
      };

      await updateAccount({ id: userId, body }).unwrap();
      toast.success("Cập nhật hồ sơ thành công!");
      setEditMode(false);
      refetch();
    } catch (e: any) {
      console.error("Update error:", e);
      toast.error(e?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  // Handle no token or userId
  if (!token || !userId) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-red-500 text-lg">Vui lòng đăng nhập để xem hồ sơ.</p>
          <button
            onClick={() => (window.location.href = "/auth?view=login")}
            className="mt-4 px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  // Handle API error
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-red-500 text-lg">
            {(error as any)?.data?.message || "Lỗi khi tải hồ sơ. Vui lòng thử lại."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <LoadingSpinner size="12" />
          <p className="text-center mt-2 text-gray-500">Đang tải hồ sơ…</p>
        </div>
      </div>
    );
  }

  // Handle no account data
  if (!account) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-500 text-lg">Không tìm thấy thông tin hồ sơ.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      {/* Header */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-[#23AEB1] via-[#23AEB1] to-[#1B8E90] relative">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-0 left-0 w-full h-px bg-white"
              style={{ transform: "rotate(15deg) translateY(20px)" }}
            />
            <div
              className="absolute top-0 left-0 w-full h-px bg-white"
              style={{ transform: "rotate(15deg) translateY(40px)" }}
            />
          </div>
        </div>

        <div className="px-6 lg:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <div className="relative shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  form.fullName || "User"
                )}`}
                alt={form.fullName}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white"
              />
              {account?.isActive && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#23AEB1] rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {form.fullName || "—"}
              </h1>
              <p className="text-gray-500 text-sm mb-3">{account?.email || "—"}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-[#23AEB1]">
                    {fmtMoney(account?.walletBalance)} ₫
                  </div>
                  <div className="text-xs text-gray-500">Số dư ví</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-[#23AEB1]">
                    {account?.totalPoint ?? 0}
                  </div>
                  <div className="text-xs text-gray-500">Tổng điểm</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-[#23AEB1]">
                    {account?.role ?? "—"}
                  </div>
                  <div className="text-xs text-gray-500">Vai trò</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-[#23AEB1]">
                    {account?.status ?? "—"}
                  </div>
                  <div className="text-xs text-gray-500">Trạng thái</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {!editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-[#23AEB1] hover:text-[#23AEB1] transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <CreditCard className="w-4 h-4" />
                    Nạp ví
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={onSave}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#23AEB1] text-white rounded-xl hover:brightness-95 transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-70"
                  >
                    {saving ? (
                      <LoadingSpinner inline color="white" size="4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setEditMode(false);
                      setForm({
                        fullName: account.fullName ?? "Tan Kim",
                        email: account.email ?? "kimltce170469@fpt.edu.vn",
                        phoneNumber: account.phoneNumber ?? "",
                        dateOfBirth: account.dateOfBirth ? new Date(account.dateOfBirth).toISOString().split("T")[0] : "",
                        gender: account.gender ?? "",
                        skillLevel: account.skillLevel ?? "",
                        membershipType: account.membershipType ?? "",
                      });
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition-all duration-200"
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Completion progress */}
          <div className="mt-6 p-4 bg-gradient-to-r from-[#E6F7F8] to-[#F7FAFC] rounded-xl border border-[#23AEB1]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Hoàn thiện hồ sơ
              </span>
              <span className="text-sm font-bold text-[#23AEB1]">
                {completionRate}%
              </span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info grid */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Personal info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#23AEB1]" />
            Thông tin cá nhân
          </h2>
          <div className="space-y-4">
            {/* Họ tên */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-0.5">Họ tên</div>
                {!editMode ? (
                  <div className="font-medium text-gray-900">
                    {form.fullName || "—"}
                  </div>
                ) : (
                  <input
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                    placeholder="Nhập họ tên"
                  />
                )}
              </div>
            </div>

            {/* Ngày sinh */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-0.5">Ngày sinh</div>
                {!editMode ? (
                  <div className="font-medium text-gray-900">
                    {form.dateOfBirth || "—"}
                  </div>
                ) : (
                  <input
                    type="date"
                    value={form.dateOfBirth || ""}
                    onChange={onChange("dateOfBirth")}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                  />
                )}
              </div>
            </div>

            {/* Giới tính */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-0.5">Giới tính</div>
                {!editMode ? (
                  <div className="font-medium text-gray-900">
                    {form.gender || "—"}
                  </div>
                ) : (
                  <select
                    value={form.gender}
                    onChange={onChange("gender")}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                  >
                    <option value="">— Chọn —</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Phone */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 text-gray-400 flex items-center justify-center text-lg">
                📱
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-0.5">Số điện thoại</div>
                {!editMode ? (
                  <div className="font-medium text-gray-900">
                    {form.phoneNumber || "—"}
                  </div>
                ) : (
                  <input
                    value={form.phoneNumber}
                    onChange={onChange("phoneNumber")}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                    placeholder="Nhập số điện thoại"
                  />
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 text-gray-400 flex items-center justify-center text-lg">
                ✉️
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-0.5">Email</div>
                {!editMode ? (
                  <div className="font-medium text-gray-900 truncate">
                    {form.email || "—"}
                  </div>
                ) : (
                  <input
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                    placeholder="abc@email.com"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences / Extra */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#23AEB1]" />
            Kỹ năng & Cài đặt
          </h2>
          <div className="space-y-4">
            {/* Skill level */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Trophy className="w-5 h-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-0.5">Trình độ</div>
                {!editMode ? (
                  <div className="font-medium text-gray-900">
                    {form.skillLevel || "—"}
                  </div>
                ) : (
                  <input
                    value={form.skillLevel}
                    onChange={onChange("skillLevel")}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                    placeholder="Beginner / Intermediate / Advanced…"
                  />
                )}
              </div>
            </div>

            {/* Membership */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-0.5">Hạng thành viên</div>
                {!editMode ? (
                  <div className="font-medium text-gray-900">
                    {form.membershipType || "—"}
                  </div>
                ) : (
                  <input
                    value={form.membershipType}
                    onChange={onChange("membershipType")}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#23AEB1] focus:border-[#23AEB1]"
                    placeholder="Silver / Gold / Platinum…"
                  />
                )}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Notification toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Thông báo lịch chơi</div>
                  <div className="font-medium text-gray-900">Nhắc nhở tự động</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifEnabled((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  notifEnabled ? "bg-[#23AEB1]" : "bg-gray-200"
                }`}
                aria-pressed={notifEnabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section
        aria-labelledby="achievements"
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6"
      >
        <h2
          id="achievements"
          className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
        >
          <Trophy className="w-5 h-5 text-[#23AEB1]" />
          Thành tích & Huy hiệu
        </h2>
        <div className="text-gray-500 text-sm">Tính năng đang phát triển.</div>
      </section>

      {(isFetching || saving) && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100 flex items-center gap-2">
          <LoadingSpinner inline size="4" />
          <span className="text-sm text-gray-600">
            {saving ? "Đang lưu thay đổi…" : "Đang đồng bộ dữ liệu…"}
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;