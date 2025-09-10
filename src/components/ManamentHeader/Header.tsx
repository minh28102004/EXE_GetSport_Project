import React from "react";
import { FiBell, FiUser, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar?: () => void;
  role?: "admin" | "staff"; // truyền role để định tuyến đúng
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, role }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (role === "admin") {
      navigate("/Admin/Settings");
    } else {
      navigate("/Staff/Settings");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {onToggleSidebar && (
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={onToggleSidebar}
            >
              <FiMenu className="w-6 h-6 text-gray-700" />
            </button>
          )}

          <h1
            className="text-2xl font-bold text-[#23AEB1]"
            style={{ fontFamily: "Fredoka One" }}
          >
            Get Sport!
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <FiBell className="w-5 h-5 text-gray-600" />
            </button>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>

          {/* Profile (clickable) */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
            onClick={handleProfileClick}
          >
            <div className="w-8 h-8 bg-[#23AEB1] rounded-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">Nguyễn Văn An</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
