import React from "react";

const AdminSettings: React.FC = () => {
  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Cài đặt</h1>
      <p className="text-gray-500 mb-6">
        Quản lý thông tin tài khoản và cài đặt hệ thống
      </p>

      <div className="flex gap-6">
        {/* Left Tabs */}
        <div className="w-1/4">
          <div className="flex flex-col gap-2">
            <button className="text-left px-4 py-2 bg-[#23AEB1] text-white rounded-md font-medium">
              Thông tin cá nhân
            </button>
            <button className="text-left px-4 py-2 hover:bg-gray-100 rounded-md">
              Bảo mật
            </button>
            <button className="text-left px-4 py-2 hover:bg-gray-100 rounded-md">
              Thông báo
            </button>
            <button className="text-left px-4 py-2 hover:bg-gray-100 rounded-md">
              Thanh toán
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#23AEB1] rounded-full flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <h2 className="text-lg font-semibold">Nguyễn Văn An</h2>
                <p className="text-gray-500">Quản lý sân bóng</p>
              </div>
            </div>

            {/* Form */}
            <form className="grid grid-cols-2 gap-4">
              {/* Họ và tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value="Nguyễn Văn An"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  value="nguyenvana@gmail.com"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full border rounded-md px-3 py-2"
                  value="0987654321"
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              {/* Địa chỉ */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value="123 Đường ABC, Quận XYZ, TP.HCM"
                />
              </div>

              {/* Giới thiệu */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới thiệu
                </label>
                <textarea
                  className="w-full border rounded-md px-3 py-2"
                  rows={3}
                  defaultValue="Quản lý sân bóng với hơn 5 năm kinh nghiệm. Chuyên tổ chức các giải đấu và sự kiện thể thao."
                />
              </div>
            </form>

            {/* Action buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button className="px-4 py-2 rounded-md border">Hủy thay đổi</button>
              <button className="px-4 py-2 rounded-md bg-[#23AEB1] text-white">
                Lưu thay đổi
              </button>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin doanh nghiệp</h2>
            <form className="grid grid-cols-2 gap-4">
              {/* Tên DN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên doanh nghiệp
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value="Sân Bóng ABC"
                />
              </div>

              {/* Mã số thuế */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value="0123456789"
                />
              </div>

              {/* Số điện thoại DN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value="028.1234567"
                />
              </div>

              {/* Email DN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email doanh nghiệp
                </label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  value="contact@sanbongabc.com"
                />
              </div>

              {/* Địa chỉ DN */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ doanh nghiệp
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value="456 Đường DEF, Quận UVW, TP.HCM"
                />
              </div>
            </form>

            {/* Action buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button className="px-4 py-2 rounded-md border">Hủy thay đổi</button>
              <button className="px-4 py-2 rounded-md bg-[#23AEB1] text-white">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
