import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Award,
  Phone,
  Mail,
  Shield,
  Zap,
} from "lucide-react";

const CTASection = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="py-12 sm:py-18 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Bắt Đầu Hành Trình Cầu Lông Của Bạn
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Tham gia cùng hàng nghìn người chơi cầu lông đã tin tưởng chúng tôi
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-white text-teal-600 rounded-xl font-bold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 flex items-center">
              <Phone className="mr-2 w-5 h-5" />
              Gọi Ngay: 1900 1234
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-teal-600 transition-all duration-300 flex items-center">
              <Mail className="mr-2 w-5 h-5" />
              Nhận Tư Vấn Miễn Phí
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;
