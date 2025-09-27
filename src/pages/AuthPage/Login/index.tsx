import React, { useState } from "react";
import { FaLock, FaFacebookF, FaApple, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { CustomTextInput, CustomPasswordInput } from "@components/Form_Input";
import LoadingSpinner from "@components/Loading_Spinner";
import useCustomForm from "@hooks/useReactHookForm";
import { GiShuttlecock } from "react-icons/gi";

interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginProps {
  onLogin?: (data: FormData) => void;
  onSocialLogin?: (platform: string) => void;
  onForgotPassword?: () => void;
  toggleView?: () => void;
}

const Login: React.FC<LoginProps> = ({
  onLogin,
  onSocialLogin,
  onForgotPassword,
  toggleView,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleFormSubmit, errors, isSubmitting, reset } =
    useCustomForm<FormData>({
      defaultValues: {
        username: "",
        password: "",
        rememberMe: false,
      },
      onSubmit: (data) => {
        setIsLoading(true);
        setTimeout(() => {
          onLogin?.(data);
          setIsLoading(false);
          reset();
        }, 1500);
      },
    });

  return (
    <div className="flex items-center justify-center p-2">
      <div className="relative w-full max-w-sm sm:max-w-md">
        <div className="bg-white/95  backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:scale-[1.01]">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 via-teal-600/70 to-teal-600/80 py-3 text-center">
            <div className="mx-auto w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-1.5 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:rotate-6">
              <GiShuttlecock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white mb-2">
              Get Sport
            </h1>
            <p className="text-teal-100 text-xs md:text-sm">
              Nền tảng đặt sân cầu lông hàng đầu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="px-5 md:px-6 pb-4 pt-3">
            <div className="text-center mb-7">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Đăng nhập
              </h2>
            </div>

            <div className="space-y-3">
             <div className="space-y-5 mb-8"> 
                <CustomTextInput
                  label="Tên người dùng"
                  name="username"
                  icon={FaUser}
                  error={errors.username?.message}
                  required
                />

                <CustomPasswordInput
                  label="Mật khẩu"
                  name="password"
                  icon={FaLock}
                  error={errors.password?.message}
                  required
                />
              </div>
              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-[0.95rem]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-teal-600 hover:underline hover:brightness-75"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-gradient-to-r from-teal-600/80 via-teal-500 to-teal-600/80 hover:brightness-90
                           disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-medium py-2.5 rounded-lg
                           transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                           flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner color="white" size="5" inline />
                    <span>Đang đăng nhập...</span>
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="px-3 text-gray-400 text-sm">Hoặc</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <button
                type="button"
                onClick={() => onSocialLogin?.("Google")}
                className="flex items-center justify-center p-1.5 border-2 border-gray-200 rounded-lg
                           transition-transform duration-200 hover:scale-105 hover:bg-gray-50"
              >
                <FcGoogle className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onSocialLogin?.("Facebook")}
                className="flex items-center justify-center p-1.5
                           hover:scale-105 bg-blue-500 border-2 border-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform duration-200"
              >
                <FaFacebookF className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onSocialLogin?.("Apple")}
                className="flex items-center justify-center p-1.5
                           hover:scale-105 bg-gray-900 border-2 border-gray-900 text-white rounded-lg hover:bg-black transition-transform duration-200"
              >
                <FaApple className="w-5 h-5" />
              </button>
            </div>

            {/* Sign Up */}
            <p className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={toggleView}
                className="text-teal-600 hover:brightness-75 font-medium hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
