import { Tooltip } from "@mui/material";
import React from "react";

interface MenuItemButtonProps {
  name: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  sidebarOpen: boolean;
  onClick: () => void;
}

const MenuItemButton: React.FC<MenuItemButtonProps> = ({
  name,
  icon,
  isActive,
  sidebarOpen,
  onClick,
}) => {
  const button = (
    <button
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`group flex w-full items-center justify-start p-3 mb-2 rounded-lg transition-all duration-300
        ${
          isActive
            ? "bg-[#1e9ea1] text-white shadow-sm"
            : "text-gray-700 hover:bg-[#1e9ea1]/15 hover:text-[#1e9ea1]"
        }
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300`}
    >
      {/* icon ăn theo currentColor */}
      <span className="text-2xl leading-none text-current">{icon}</span>

      <span
        className={`ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? "opacity-100 max-w-xs text-md font-medium" : "opacity-0 max-w-0"
        }`}
        style={{ whiteSpace: "nowrap" }}
      >
        {name}
      </span>
    </button>
  );

  return sidebarOpen ? (
    button
  ) : (
    <Tooltip title={name} placement="right" arrow>
      {button}
    </Tooltip>
  );
};

export default MenuItemButton;
