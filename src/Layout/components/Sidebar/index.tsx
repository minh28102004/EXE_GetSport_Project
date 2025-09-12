import React from "react";
import MenuItemButton from "../MenuItemButton";
import {
  SettingOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import Avatar from "@components/Avatar_User_Image";

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  menuItems: MenuItem[];
  locationPath: string;
  navigateTo: (path: string) => void;
  user?: { name?: string; userName?: string; email?: string; avatar?: string };
  onOpenProfile: () => void;
  onCloseMobile?: () => void;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  isMobile,
  sidebarRef,
  menuItems,
  locationPath,
  navigateTo,
  user,
  onOpenProfile,
  onCloseMobile,
  toggleSidebar,
}) => {
  const PRIMARY_COLOR = "#1e9ea1";

  return (
    <>
      {/* Sidebar chính */}
      <aside
        ref={sidebarRef}
        className={`flex flex-col h-full bg-white p-2 shadow-xl overflow-hidden transition-all duration-500 ease-in-out
        ${
          isMobile
            ? `fixed top-0 left-0 h-full z-50 transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } w-68`
            : `${sidebarOpen ? "min-w-60 max-w-60" : "min-w-16 max-w-16"}`
        }`}
      >
        {/* Header: Logo + nút toggle khi đóng */}
        <div
          className={`flex items-center relative ${
            isMobile
              ? "border-b border-gray-200"
              : sidebarOpen
              ? "px-2 py-1"
              : "pb-1 mr-1"
          }`}
        >
          {/* Logo */}
          <span
            className={`font-bold transition-all duration-300 ${ 
              sidebarOpen ? "text-4xl" : "text-3xl"
            }`}
            style={{ color: PRIMARY_COLOR }}
          >
            {sidebarOpen ? "Get Sport" : ""}
          </span>

          {/* Khi sidebar đóng: chỉ hiện nút trong header */}
          {!isMobile && !sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="ml-auto flex items-center justify-center
                         w-10 h-10 rounded-xl 
                         bg-white hover:brightness-90
                         transition-all duration-300"
            >
              <FiChevronRight size={22} />
            </button>
          )}

          {/* Close button mobile */}
          {isMobile && sidebarOpen && (
            <button
              onClick={onCloseMobile}
              className="absolute right-2 top-6 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 hover:shadow-md transition-all duration-200"
            >
              <CloseOutlined className="text-lg text-gray-600" />
            </button>
          )}
        </div>

        <hr className="border-gray-200 mb-2" />

        {/* Menu */}
        <nav className="flex-1 overflow-hidden">
          {menuItems.map((item) => (
            <MenuItemButton
              key={item.name}
              name={item.name}
              icon={item.icon}
              path={item.path}
              isActive={locationPath.startsWith(item.path)}
              sidebarOpen={sidebarOpen}
              onClick={() => {
                navigateTo(item.path);
                if (isMobile && onCloseMobile) onCloseMobile();
              }}
            />
          ))}
        </nav>

        {/* Bottom Section */}
        <div
          className={`border-t border-gray-200 pt-2 ${
            sidebarOpen ? "space-y-1.5" : ""
          }`}
        >
          {user && (
            <div
              className={`flex items-center px-2 rounded-lg cursor-pointer transition-all ${
                sidebarOpen
                  ? "justify-between space-x-2 py-1.5"
                  : "flex-col space-y-1 justify-center"
              }`}
            >
              {sidebarOpen ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Avatar
                      name={user?.name}
                      avatarUrl={user?.avatar}
                      size={32}
                    />
                    <div className="flex flex-col">
                      <p className="font-medium text-sm">
                        {user?.userName || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <Tooltip title="View profile" placement="top">
                    <button
                      onClick={onOpenProfile}
                      className="h-8 w-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <SettingOutlined className="text-gray-600 text-xl" />
                    </button>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="View profile" placement="right">
                  <button
                    onClick={onOpenProfile}
                    className="h-8 w-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <SettingOutlined className="text-gray-600 text-xl" />
                  </button>
                </Tooltip>
              )}
            </div>
          )}

          {/* Logout */}
          <Tooltip
            title="Logout"
            placement="right"
            arrow
            disableHoverListener={sidebarOpen}
          >
            <button
              onClick={() => alert("Logging out...")}
              className={`flex items-center w-full px-2 py-1.5 rounded-lg hover:bg-red-100 text-red-600 ${
                sidebarOpen ? "justify-start " : "justify-center "
              }`}
            >
              <LogoutOutlined
                className={`text-xl ${sidebarOpen ? "" : "ml-1.5"}`}
              />
              <span
                className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${
                  sidebarOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                Logout
              </span>
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* Khi sidebar mở: toggle button bám mép ngoài */}
      {!isMobile && sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 flex items-center justify-center
                   rounded-xl
                   bg-white hover:brightness-90 
                   transition-all duration-500"
          style={{
            top: "0.75rem", // top-3
            left: "212px", // mép ngoài sidebar mở
            width: "36px",
            height: "36px",
            transform: "translateX(-50%)",
          }}
        >
          <FiChevronLeft size={22} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
