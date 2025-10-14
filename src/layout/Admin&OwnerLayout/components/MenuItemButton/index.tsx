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
      className={`flex items-center w-full p-3 mb-2 rounded-lg transition-all duration-300 justify-start
        ${
          isActive
            ? "bg-[#1e9ea1] text-[#1e9ea1]"
            : "hover:bg-[#1e9ea1]/20 hover:text-[#1e9ea1]"
        }`}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className={`ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? "opacity-100 max-w-xs text-md font-medium"
            : "opacity-0 max-w-0"
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
