import { Play, Sparkles, Download } from "lucide-react";
import { motion } from "framer-motion";
import { stats } from "../data";

const HeroSection = () => {
  return (
    <div>
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 flex items-center">
        {/* Animated Background */}
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] animate-pulse'></div>

        <div className="relative container mx-auto px-6 py-18">
          <div className="text-center text-white">
            <motion.div
              className="inline-flex items-center bg-white/20 rounded-full px-6 py-2 mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }} 
            >
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              <span className="text-sm font-medium">
                Về Get Sport - Nền tảng #1
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                Kết Nối Đam Mê
              </span>
              <br />
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Cầu Lông
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-cyan-50 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Nền tảng đặt sân cầu lông hàng đầu Việt Nam với
              <span className="font-semibold text-yellow-300">
                {" "}
                50,000+ người dùng
              </span>
              ,
              <span className="font-semibold text-yellow-300">
                {" "}
                1,200+ sân
              </span>{" "}
              và
              <span className="font-semibold text-yellow-300">
                {" "}
                AI thông minh
              </span>{" "}
              kết nối cộng đồng
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button className="group bg-white text-teal-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300 shadow-xl flex items-center justify-center">
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Tải ứng dụng ngay
              </button>
              <button className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-teal-600 transition-all duration-300 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Xem video demo
              </button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {stats.slice(0, 4).map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-cyan-100">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <motion.div
          className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </section>
    </div>
  );
};

export default HeroSection;
