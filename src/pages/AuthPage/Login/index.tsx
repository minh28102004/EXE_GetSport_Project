import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaFacebookF, FaApple } from "react-icons/fa";

import logo from "@images/logo/logo.png";
import { CustomTextInput, CustomPasswordInput } from "@components/Form_Input";

interface LoginProps {
  toggleView: () => void;
}

const Login: React.FC<LoginProps> = ({ toggleView }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Login data:", data);
  };

  return (
    <motion.div
      className="max-w-md w-full space-y-8"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="text-center border-b border-gray-300 pb-4">
          <motion.img
            src={logo}
            alt="Logo"
            className="mx-auto w-44 h-20 mb-2 object-contain drop-shadow-lg"
            initial={{ rotate: -5, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              rotate: 3,
              filter: "drop-shadow(0 0 4px #00BFB3)",
              transition: { type: "spring", stiffness: 300 },
            }}
          />
          <h2 className="text-2xl font-bold text-gray-900">Đăng Nhập</h2>
          <p className="mt-2 text-sm text-gray-600">
            Đăng nhập để trải nghiệm dịch vụ đặt sân cầu lông tốt nhất
          </p>
        </div>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <CustomTextInput
            label="Email:"
            name="email"
            icon={FaEnvelope}
            register={register}
            errors={errors}
            placeholder="Nhập email hoặc tên đăng nhập"
            validation={{ required: "Vui lòng nhập email hoặc tên đăng nhập" }}
          />

          <CustomPasswordInput
            label="Mật khẩu:"
            name="password"
            icon={FaLock}
            register={register}
            errors={errors}
            placeholder="Nhập mật khẩu"
            validation={{ required: "Vui lòng nhập mật khẩu" }}
          />

          <div className="flex justify-end mt-3">
            <Link
              to="/forgot-password"
              className="text-sm text-[#00BFB3] hover:underline hover:brightness-75"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#00BFB3] focus:ring-[#00BFB3] border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div
            role="button"
            onClick={handleSubmit(onSubmit)}
            className="w-full cursor-pointer text-center py-3 px-4 rounded-md shadow-md text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300 transform hover:scale-[1.03] active:scale-95 hover:brightness-95"
          >
            Đăng Nhập
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Hoặc đăng nhập bằng
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <button className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-[#2563EB] text-white hover:bg-blue-700 transition-all">
              <FaFacebookF />
            </button>
            <button className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-500 hover:bg-gray-100 transition-all">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_105_174)">
                  <path
                    d="M17.64 9.20455C17.64 8.56682 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29H0.957275V9.62182C0.347727 7.54545 0.347727 10.4545 0.957275 12.5318L3.96409 10.71Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_105_174">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-black text-white hover:bg-gray-800 transition-all">
              <FaApple />
            </button>
          </div>
        </div>
        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              onClick={toggleView}
              className="font-medium text-[#00BFB3] hover:underline hover:brightness-75"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
