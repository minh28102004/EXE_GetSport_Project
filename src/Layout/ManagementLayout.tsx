import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@components/ManamentHeader/Header";
import Sidebar from "@components/ManagementSidebar/Sidebar";

interface ManagementLayoutProps {
  role: "admin" | "staff";
}

const ManagementLayout: React.FC<ManagementLayoutProps> = ({ role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header với nút toggle */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        role={role} // ✅ truyền role xuống Header
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar role={role} isOpen={isSidebarOpen} />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagementLayout;
