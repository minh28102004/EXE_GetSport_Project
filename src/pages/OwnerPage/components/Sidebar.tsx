import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiCalendar,
  FiMessageSquare,
  FiStar,
  FiSettings,
} from "react-icons/fi";

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: "Tổng quan", path: "/Staff/Dashboard", icon: <FiHome /> },
    { name: "Quản lý sân", path: "/Staff/CourtManagement", icon: <FiGrid /> },
    { name: "Đơn đặt sân", path: "/Staff/BookingManagement", icon: <FiCalendar /> },
    { name: "Phản hồi khách hàng", path: "/Staff/Feedback", icon: <FiStar /> },
    { name: "Tin nhắn", path: "/Staff/Messages", icon: <FiMessageSquare />, badge: 2 },
    { name: "Cài đặt", path: "/Staff/Settings", icon: <FiSettings /> },
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

                {/* Badge (vd: tin nhắn có số đỏ) */}
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
