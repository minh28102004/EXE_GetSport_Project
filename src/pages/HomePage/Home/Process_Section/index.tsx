import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Search,
  Calendar,
  CheckCircle,
} from "lucide-react";

const ProcessSection = () => {
  return (
    <>
      {/* Process Section */}
      <section className="py-20 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quy Trình Đặt Sân
            </h2>
            <p className="text-xl text-gray-600">
              Chỉ 3 bước đơn giản để có sân cầu lông ưng ý
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-teal-300 to-teal-400 transform -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-teal-300 to-teal-400 transform -translate-y-1/2"></div>

            {[
              {
                step: "01",
                title: "Tìm & Chọn",
                desc: "Tìm sân phù hợp theo vị trí và thời gian",
                icon: Search,
              },
              {
                step: "02",
                title: "Đặt & Thanh Toán",
                desc: "Xác nhận thông tin và thanh toán an toàn",
                icon: Calendar,
              },
              {
                step: "03",
                title: "Nhận & Chơi",
                desc: "Nhận xác nhận và đến sân đúng giờ",
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto mb-6 flex items-center justify-center border-4 border-teal-200">
                  <item.icon className="w-8 h-8 text-teal-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProcessSection;
