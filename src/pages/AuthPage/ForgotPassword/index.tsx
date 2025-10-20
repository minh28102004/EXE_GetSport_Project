import React, { useState } from "react";
import {
  FiMail,
  FiCheck,
  FiAlertCircle,
  FiShield,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import LoadingSpinner from "@components/Loading_Spinner";
import { useForgotPasswordMutation } from "@redux/api/auth/authApi";

interface ForgotPasswordProps {
  toggleView?: () => void;
  onEmailSent?: (email: string) => void;
  onResendEmail?: (email: string) => void;
}

interface FormData {
  email: string;
}

interface ValidationErrors {
  email?: string;
}

// Email validation
const useEmailValidation = () => {
  const validateEmail = (email: string): string | null => {
    if (!email) return "Email là bắt buộc";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Định dạng email không hợp lệ";
    return null;
  };
  return { validateEmail };
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  toggleView,
  onEmailSent,
  onResendEmail,
}) => {
  const [currentStep, setCurrentStep] = useState<"input" | "sent" | "success">(
    "input"
  );
  const [formData, setFormData] = useState<FormData>({ email: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [apiError, setApiError] = useState<string | null>(null);

  const [forgotPassword] = useForgotPasswordMutation();
  const { validateEmail } = useEmailValidation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setApiError(null);
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await forgotPassword({ email: formData.email }).unwrap();
      if (response.statusCode === 200) {
        onEmailSent?.(formData.email);
        setCurrentStep("sent");
        startCountdown();
      } else {
        setApiError(response.message || "Không thể gửi email khôi phục");
      }
    } catch (error: any) {
      setApiError(error?.data?.message || "Không thể gửi email khôi phục");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await forgotPassword({ email: formData.email }).unwrap();
      if (response.statusCode === 200) {
        onResendEmail?.(formData.email);
        startCountdown();
      } else {
        setApiError(response.message || "Không thể gửi lại email");
      }
    } catch (error: any) {
      setApiError(error?.data?.message || "Không thể gửi lại email");
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const renderInputStep = () => (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center pb-2.5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1.5">
          Khôi phục mật khẩu
        </h2>
        <p className="text-gray-600 max-w-sm mx-auto text-sm md:text-[0.95rem]">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu
        </p>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700"
        >
          Địa chỉ email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <FiMail
              className={`h-5 w-5 transition-colors duration-200 ${
                errors.email || apiError ? "text-red-400" : "text-gray-400"
              }`}
            />
          </div>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-xl outline-none bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200
            ${
              errors.email || apiError
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                : "border-gray-200 hover:border-teal-400/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
            }`}
            placeholder="your@email.com"
            aria-describedby={errors.email || apiError ? "email-error" : undefined}
          />
        </div>

        {(errors.email || apiError) && (
          <div className="flex items-center gap-1 text-red-600 animate-shake">
            <FiAlertCircle className="w-4 h-4" />
            <p className="text-sm">{errors.email || apiError}</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
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
            <span>Đang gửi...</span>
          </span>
        ) : (
          <span className="inline-flex items-center">
            <FiMail className="w-5 h-5 mr-2" />
            Gửi email khôi phục
          </span>
        )}
      </button>

      {/* Toggle back to login */}
      <div className="text-center mt-3.5">
        <p className="text-sm text-gray-600">
          Bạn đã nhớ mật khẩu?{" "}
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

  const renderSentStep = () => (
    <div className="space-y-7 text-center">
      {/* Success Icon */}
      <div className="mx-auto w-18 h-18 bg-teal-100 rounded-full flex items-center justify-center mb-2.5 animate-pulse">
        <FiCheck className="w-9 h-9 text-teal-600" />
      </div>

      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Email đã được gửi!
        </h2>
        <p className="text-gray-600 mb-1.5 text-sm md:text-[0.95rem]">
          Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến:
        </p>
        <p className="text-teal-600 font-semibold text-[1.05rem] break-all">
          {formData.email}
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 space-y-3.5 text-left">
        <div className="flex items-start gap-3">
          <FiShield className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 mb-0.5">
              Kiểm tra email của bạn
            </p>
            <p className="text-sm text-gray-600">
              Click vào link trong email để thiết lập mật khẩu mới
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiClock className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 mb-0.5">
              Thời gian hiệu lực
            </p>
            <p className="text-sm text-gray-600">
              Link sẽ hết hạn sau 1 giờ vì lý do bảo mật
            </p>
          </div>
        </div>
      </div>

      {/* Resend Button */}
      <p className="text-sm text-gray-600">
        Không nhận được email?{" "}
        <button
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className={`font-medium transition-colors duration-200 ${
            canResend && !isLoading
              ? "text-teal-600 hover:text-teal-700 hover:underline"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <span className="inline-flex items-center">
              <span className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent mr-1" />
              Đang gửi...
            </span>
          ) : canResend ? (
            <span className="inline-flex items-center">
              <FiRefreshCw className="w-3.5 h-3.5 mr-1" />
              Gửi lại
            </span>
          ) : (
            `Gửi lại sau ${countdown}s`
          )}
        </button>
      </p>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-2">
      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg  overflow-hidden transition-all duration-300 hover:scale-[1.01]">
          {/* Header with branding */}
          <div className="relative bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 px-7 py-4 text-center">
            <div
              className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20`}
            ></div>
            <div className="relative">
              <div className="mx-auto w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-1.5 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:rotate-6">
                <FiMail className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-white mb-0.5">
                Get Sport
              </h1>
              <p className="text-teal-100 text-xs md:text-sm">
                Hỗ trợ khôi phục tài khoản
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 md:px-7 pt-5 pb-6">
            <div className="transition-all duration-300 ease-in-out">
              {currentStep === "input" && renderInputStep()}
              {currentStep === "sent" && renderSentStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;