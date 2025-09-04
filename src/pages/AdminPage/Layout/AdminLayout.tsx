import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // có thể tạo AdminHeader riêng nếu cần
import Sidebar from "../components/Sidebar"; // sidebar admin mà mình code ở trên

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* render Dashboard / CourtManagement / RevenueByArea / Reports / UserManagement */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
