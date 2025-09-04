import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const StaffLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF1E8] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet /> {/* render Dashboard / CourtManagement / BookingManagement */}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
