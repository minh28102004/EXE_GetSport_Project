import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiBarChart2,
  FiCalendar,
  FiFileText,
  FiUsers,
} from "react-icons/fi";

const SidebarAdmin: React.FC = () => {
  const menuItems = [
    { name: "Tổng quan", path: "/Admin/Dashboard", icon: <FiHome /> },
    { name: "Quản lý sân", path: "/Admin/CourtManagement", icon: <FiGrid /> },
    { name: "Quản lý đơn đặt sân", path: "/Admin/BookingManagement", icon: <FiCalendar /> },
    // { name: "Doanh thu khu vực", path: "/Admin/RevenueByArea", icon: <FiBarChart2 /> },
    { name: "Báo cáo đặt sân", path: "/Admin/BookingReport", icon: <FiCalendar /> },
    // { name: "Doanh thu theo tháng", path: "/Admin/MonthlyRevenue", icon: <FiBarChart2 /> },
    // { name: "Xuất báo cáo", path: "/Admin/ExportReports", icon: <FiFileText /> },
    { name: "Quản lý người dùng", path: "/Admin/UserManagement", icon: <FiUsers /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 text-2xl font-bold text-[#23AEB1]">Get Sport!</div>

      {/* Menu */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                    isActive
                      ? "bg-[#23AEB1] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer (Admin info) */}
      <div className="p-4 border-t flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-[#23AEB1] text-white flex items-center justify-center font-bold">
          A
        </div>
        <div>
          <p className="font-semibold">Nguyễn Văn Admin</p>
          <p className="text-sm text-gray-500">Super Admin</p>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
