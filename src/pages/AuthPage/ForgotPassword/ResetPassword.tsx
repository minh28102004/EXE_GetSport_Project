import React, { useState, useEffect } from "react";
import { FiLock, FiAlertCircle, FiCheck } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@components/Loading_Spinner";
import { useResetPasswordMutation } from "@redux/api/auth/authApi";

interface ResetPasswordProps {
  toggleView?: () => void;
}

interface FormData {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  password?: string;
  confirmPassword?: string;
}

const usePasswordValidation = () => {
  const validatePassword = (password: string): string | null => {
    if (!password) return "Mật khẩu là bắt buộc";
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    return null;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return "Xác nhận mật khẩu là bắt buộc";
    if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp";
    return null;
  };

  return { validatePassword, validateConfirmPassword };
};

const ResetPassword: React.FC<ResetPasswordProps> = ({ toggleView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<"input" | "success">("input");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [resetPassword] = useResetPasswordMutation();
  const { validatePassword, validateConfirmPassword } = usePasswordValidation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email") || "";
    const token = params.get("token") || "";
    setFormData((prev) => ({ ...prev, email, token }));
  }, [location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setApiError(null);
  };

  const handleSubmit = async () => {
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    if (!formData.email || !formData.token) {
      setApiError("Email hoặc token không hợp lệ");
      return;
    }

    setIsLoading(true);
    setApiError(null);
    try {
      const response = await resetPassword({
        email: formData.email,
        token: formData.token,
        newPassword: formData.password,
      }).unwrap();
      if (response.statusCode === 200) {
        setCurrentStep("success");
        setTimeout(() => navigate("/auth?view=login"), 3000);
      } else {
        setApiError(response.message || "Không thể đặt lại mật khẩu");
      }
    } catch (error: any) {
      setApiError(error?.data?.message || "Không thể đặt lại mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputStep = () => (
    <div className="space-y-5">
      <div className="text-center pb-2.5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1.5">
          Đặt lại mật khẩu
        </h2>
        <p className="text-gray-600 max-w-sm mx-auto text-sm md:text-[0.95rem]">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700"
        >
          Mật khẩu mới
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <FiLock
              className={`h-5 w-5 transition-colors duration-200 ${
                errors.password || apiError ? "text-red-400" : "text-gray-400"
              }`}
            />
          </div>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-xl outline-none bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200
            ${
              errors.password || apiError
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                : "border-gray-200 hover:border-teal-400/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
            }`}
            placeholder="Nhập mật khẩu mới"
            aria-describedby={errors.password || apiError ? "password-error" : undefined}
          />
        </div>
        {errors.password && (
          <div className="flex items-center gap-1 text-red-600 animate-shake">
            <FiAlertCircle className="w-4 h-4" />
            <p className="text-sm">{errors.password}</p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-gray-700"
        >
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <FiLock
              className={`h-5 w-5 transition-colors duration-200 ${
                errors.confirmPassword || apiError ? "text-red-400" : "text-gray-400"
              }`}
            />
          </div>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-xl outline-none bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200
            ${
              errors.confirmPassword || apiError
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                : "border-gray-200 hover:border-teal-400/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
            }`}
            placeholder="Xác nhận mật khẩu"
            aria-describedby={errors.confirmPassword || apiError ? "confirmPassword-error" : undefined}
          />
        </div>
        {(errors.confirmPassword || apiError) && (
          <div className="flex items-center gap-1 text-red-600 animate-shake">
            <FiAlertCircle className="w-4 h-4" />
            <p className="text-sm">{errors.confirmPassword || apiError}</p>
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700
                   disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-xl
                   transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-teal-500/40"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <LoadingSpinner color="white" size="5" inline />
            <span>Đang xử lý...</span>
          </span>
        ) : (
          <span className="inline-flex items-center">
            <FiLock className="w-5 h-5 mr-2" />
            Đặt lại mật khẩu
          </span>
        )}
      </button>
      <div className="text-center mt-3.5">
        <p className="text-sm text-gray-600">
          Trở lại đăng nhập?{" "}
          <button
            onClick={toggleView}
            className="text-teal-600 hover:brightness-90 font-medium hover:underline"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-7 text-center">
      <div className="mx-auto w-18 h-18 bg-teal-100 rounded-full flex items-center justify-center mb-2.5 animate-pulse">
        <FiCheck className="w-9 h-9 text-teal-600" />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Mật khẩu đã được đặt lại!
        </h2>
        <p className="text-gray-600 mb-1.5 text-sm md:text-[0.95rem]">
          Mật khẩu của bạn đã được cập nhật thành công.
        </p>
        <p className="text-gray-600 text-sm md:text-[0.95rem]">
          Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát...
        </p>
      </div>
      <button
        onClick={() => navigate("/auth?view=login")}
        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700
                   text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg
                   focus:outline-none focus:ring-4 focus:ring-teal-500/40"
      >
        <span className="inline-flex items-center">
          <FiLock className="w-5 h-5 mr-2" />
          Đăng nhập ngay
        </span>
      </button>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-2">
      <div className="relative w-full max-w-sm sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:scale-[1.01]">
          <div className="relative bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 px-7 py-4 text-center">
            <div
              className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20`}
            ></div>
            <div className="relative">
              <div className="mx-auto w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-1.5 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:rotate-6">
                <FiLock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-white mb-0.5">
                Get Sport
              </h1>
              <p className="text-teal-100 text-xs md:text-sm">
                Đặt lại mật khẩu
              </p>
            </div>
          </div>
          <div className="px-6 md:px-7 pt-5 pb-6">
            <div className="transition-all duration-300 ease-in-out">
              {currentStep === "input" && renderInputStep()}
              {currentStep === "success" && renderSuccessStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;