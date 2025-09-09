import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaFacebookF,
  FaApple,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";
import { CustomTextInput, CustomPasswordInput } from "@components/Form_Input";
import LoadingSpinner from "@components/Loading_Spinner";
import useCustomForm from "@hooks/useReactHookForm";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface RegisterProps {
  toggleView: () => void;
  onRegister?: (data: FormData) => void;
  onSocialRegister?: (platform: string) => void;
}

const Register: React.FC<RegisterProps> = ({
  toggleView,
  onRegister,
  onSocialRegister,
}) => {
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isMultiline, setIsMultiline] = useState(false);
  const passwordDescriptionRef = useRef<HTMLParagraphElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let strength = 0;
    if (password) {
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
    }
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    if (passwordDescriptionRef.current) {
      const computed = window.getComputedStyle(passwordDescriptionRef.current);
      const lineHeight = parseFloat(computed.lineHeight);
      const height = passwordDescriptionRef.current.offsetHeight;
      setIsMultiline(height > lineHeight + 1); // +1 để tránh sai số
    }
  }, [passwordStrength]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-gray-300 w-0";
      case 1:
        return "bg-red-500/80 w-1/5";
      case 2:
        return "bg-orange-400/80 w-2/5";
      case 3:
        return "bg-yellow-400 w-3/5";
      case 4:
        return "bg-lime-500 w-4/5";
      case 5:
        return "bg-green-600/80 w-full";
      default:
        return "bg-gray-200 w-0";
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return "0%";
      case 1:
        return "20% - Rất yếu";
      case 2:
        return "40% - Yếu";
      case 3:
        return "60% - Trung bình";
      case 4:
        return "80% - Mạnh";
      case 5:
        return "100% - Rất mạnh";
      default:
        return "";
    }
  };

  const { register, handleFormSubmit, errors, isSubmitting, reset, watch } =
    useCustomForm<FormData>({
      defaultValues: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
      },
      onSubmit: (data) => {
        setIsLoading(true);
        setTimeout(() => {
          onRegister?.(data);
          setIsLoading(false);
          reset();
        }, 1500);
      },
    });
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  return (
    <div className="flex items-center justify-center p-2">
      <div className="relative w-full max-w-xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-500 hover:scale-[1.02]">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 py-2.5 text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-1 backdrop-blur-sm transform transition-all duration-500 hover:scale-110 hover:rotate-12">
              <GiShuttlecock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Get Sport</h1>
            <p className="text-teal-100 text-sm">
              Nền tảng đặt sân cầu lông chuyên nghiệp, dễ dàng, đáng tin cậy
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="px-6 pt-3 pb-4 ">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Đăng ký</h2>
            </div>

            {/* ==== INPUT GRID (2 COLUMN) ==== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <CustomTextInput
                label="Tên người dùng"
                name="username"
                placeholder="Nhập tên người dùng"
                icon={FaUser}
                error={errors.username?.message}
                required
                register={register("username")}
              />
              <CustomTextInput
                label="Email"
                name="email"
                placeholder="Nhập email"
                icon={FaEnvelope}
                error={errors.email?.message}
                required
                type="email"
                register={register("email")}
              />
              <CustomPasswordInput
                label="Mật khẩu"
                name="password"
                placeholder="Nhập mật khẩu"
                icon={FaLock}
                error={errors.password?.message}
                required
                register={register("password", {
                  onChange: (e) => setPassword(e.target.value),
                })}
              />
              {/* Password Strength Indicator */}
              {password && (
                <div
                  className={`${isMultiline ? "mt-2" : "mt-4"}`} // margin ngoài thay đổi tùy multiline
                >
                  <span className="text-sm font-medium text-gray-700">
                    Độ mạnh: {getPasswordStrengthLabel()}
                  </span>
                  <div className="h-2 rounded-full bg-gray-200 mt-0.5">
                    <div
                      className={`${getPasswordStrengthColor()} h-2 rounded-full transition-all duration-300`}
                    />
                  </div>
                  <p
                    className="mt-1.5 text-xs italic text-gray-500"
                    ref={passwordDescriptionRef}
                  >
                    {" "}
                    {/* Bỏ margin-top ở p */}
                    {passwordStrength <= 1 &&
                      "Mật khẩu quá yếu, hãy thêm chữ hoa, số hoặc ký tự đặc biệt."}
                    {passwordStrength === 2 &&
                      "Mật khẩu yếu, nên bổ sung thêm độ đa dạng ký tự."}
                    {passwordStrength === 3 &&
                      "Mức độ trung bình, có thể tốt hơn với nhiều ký tự hơn."}
                    {passwordStrength === 4 && "Mạnh, bạn đang làm tốt!"}
                    {passwordStrength === 5 && "Rất mạnh! Tuyệt vời!"}
                  </p>
                </div>
              )}

              <CustomPasswordInput
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                icon={FaLock}
                error={errors.confirmPassword?.message}
                required
                register={register("confirmPassword")}
              />

              {/* Feedback giống password strength */}
              {confirmPasswordValue && (
                <div className="mt-6 flex items-center gap-2">
                  {confirmPasswordValue === passwordValue ? (
                    <div className="w-full">
                      <div className="flex items-center gap-1.5">
                        <FaCheckCircle
                          size={16}
                          className="text-green-600/80 text-lg mb-0.5"
                        />
                        <span className="text-sm font-medium text-green-600">
                          Mật khẩu khớp!
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 mt-1">
                        <div className="w-full h-2 rounded-full bg-green-600/60 transition-all duration-300" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flex items-center gap-1.5">
                        <FaTimesCircle
                          size={16}
                          className="text-red-600/80 text-lg mb-0.5"
                        />
                        <span className="text-sm font-medium text-red-600">
                          Mật khẩu chưa khớp
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 mt-1">
                        <div className="w-2/5 h-2 rounded-full bg-red-600/60 transition-all duration-300" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Agree Terms */}
            <label className="flex items-center gap-2 text-sm mb-5">
              <input
                type="checkbox"
                className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                {...register("agreeTerms")}
                required
              />
              <span>
                Tôi đồng ý với các{" "}
                <a
                  href="/terms"
                  className="text-teal-600 hover:brightness-75 hover:underline"
                >
                  điều khoản dịch vụ
                </a>
              </span>
            </label>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white  hover:scale-[1.02] font-medium py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner color="white" size="6" inline />
                  <span>Đang đăng ký...</span>
                </div>
              ) : (
                "Đăng ký"
              )}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="px-3 text-gray-400 text-sm">
                Hoặc đăng ký bằng
              </span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            {/* Social Register */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => onSocialRegister?.("Google")}
                className="flex items-center justify-center p-2 border-2 transition-transform duration-300 ease-in-out hover:scale-105 border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <FcGoogle className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onSocialRegister?.("Facebook")}
                className="flex items-center justify-center p-2 ransition-transform duration-300 ease-in-out hover:scale-105 bg-blue-500 border-2 border-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaFacebookF className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onSocialRegister?.("Apple")}
                className="flex items-center justify-center p-2 transition-transform duration-300 ease-in-out hover:scale-105 bg-black border-2 border-black text-white rounded-lg hover:bg-gray-800"
              >
                <FaApple className="w-5 h-5" />
              </button>
            </div>

            {/* Login toggle */}
            <p className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={toggleView}
                className="text-teal-600 hover:brightness-75 font-medium hover:underline"
              >
                Đăng nhập ngay
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
