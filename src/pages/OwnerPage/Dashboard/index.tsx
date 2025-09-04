import React from "react";
import { FiGrid, FiCalendar, FiDollarSign, FiStar } from "react-icons/fi";

const Dashboard: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tổng quan</h2>
        <p className="text-gray-600">Xem tổng quan hoạt động kinh doanh của bạn</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Courts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng số sân</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FiGrid className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đặt sân hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Doanh thu tháng</p>
              <p className="text-2xl font-bold text-gray-900">45.2M</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đánh giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <FiStar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        {/* TODO: Thêm activity list ở đây */}
      </div>
    </>
  );
};

export default Dashboard;
