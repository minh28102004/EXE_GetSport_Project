import React, { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaFacebookF,
  FaApple,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GiShuttlecock } from "react-icons/gi";
import { CustomTextInput, CustomPasswordInput } from "@components/Form_Input";
import LoadingSpinner from "@components/Loading_Spinner";
import useCustomForm from "@hooks/useReactHookForm";
import endPoint from "@routes/router";
import FieldTooltip from "@components/Tooltip/fieldTooltip";
import {
  usePasswordStrength,
  barClassFor,
  labelForScore,
} from "@hooks/usePasswordStrength";

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
  const [isLoading, setIsLoading] = useState(false);

  const passAnchorRef = useRef<HTMLDivElement>(null);
  const confirmAnchorRef = useRef<HTMLDivElement>(null);

  const [passFocused, setPassFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  // NEW: chỉ show tooltip khi đã nhập
  const [passTyped, setPassTyped] = useState(false);
  const [confirmTyped, setConfirmTyped] = useState(false);

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
          setPassTyped(false);
          setConfirmTyped(false);
        }, 1100);
      },
    });

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  // strength gốc 0..5
  const { score: passwordStrength } = usePasswordStrength(passwordValue ?? "");

  // NEW: hiển thị tối thiểu = 1 khi đã nhập (bắt đầu từ case 1)
  const displayStrength = passTyped ? Math.max(1, passwordStrength) : 0;
  const strengthLabel = labelForScore(displayStrength);

  const openPassTooltip = passFocused && passTyped; // chỉ mở khi đã nhập
  const openConfirmTooltip =
    confirmFocused && (confirmTyped || (confirmPasswordValue?.length ?? 0) > 0);

  return (
    <div className="flex items-center justify-center p-2">
      <div className="relative w-full max-w-sm sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:scale-[1.01]">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 via-teal-600/70 to-teal-600/80 py-4">
            <div className="mx-auto flex items-center justify-center gap-2">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-1.5 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:rotate-6">
                <GiShuttlecock className="w-7 h-7 text-white" />
              </div>
              <h1 className="ml-1 text-base md:text-lg font-bold text-white">
                Get Sport
              </h1>
            </div>
            <p className="text-center text-teal-100 text-xs md:text-sm mt-0.5">
              Nền tảng đặt sân cầu lông chuyên nghiệp, dễ dàng, đáng tin cậy
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleFormSubmit}
            className="px-4 md:px-5 pt-3 pb-4 space-y-3.5"
          >
            <div className="text-center mb-7">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Đăng ký
              </h2>
            </div>

            <div className="space-y-5 mb-7">
              <CustomTextInput
                label="Tên người dùng"
                name="username"
                icon={FaUser}
                error={errors.username?.message}
                required
                register={register("username")}
              />

              <CustomTextInput
                label="Email"
                name="email"
                icon={FaEnvelope}
                error={errors.email?.message}
                required
                type="email"
                register={register("email")}
              />

              {/* Password + Tooltip (chỉ hiện khi đã nhập) */}
              <div
                ref={passAnchorRef}
                className="relative"
                onFocusCapture={() => setPassFocused(true)}
                onBlurCapture={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (!e.currentTarget.contains(next)) setPassFocused(false);
                }}
              >
                <CustomPasswordInput
                  label="Mật khẩu"
                  name="password"
                  icon={FaLock}
                  error={errors.password?.message}
                  required
                  register={register("password", {
                    onChange: (e) =>
                      setPassTyped((e.target.value?.length ?? 0) > 0),
                  })}
                />
                <FieldTooltip
                  anchorRef={passAnchorRef}
                  open={openPassTooltip}
                  desktopMaxWidthPx={300}
                >
                  <div className="text-sm font-medium text-gray-800 whitespace-nowrap">
                    Độ mạnh: {strengthLabel}
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200">
                    <div
                      className={`${barClassFor(
                        displayStrength
                      )} h-2 rounded-full transition-all duration-300`}
                    />
                  </div>
                  <p className="mt-1.5 text-xs italic text-gray-500">
                    {displayStrength <= 1 &&
                      "Mật khẩu quá yếu, hãy thêm chữ hoa, số hoặc ký tự đặc biệt."}
                    {displayStrength === 2 &&
                      "Mật khẩu yếu, nên bổ sung thêm độ đa dạng ký tự."}
                    {displayStrength === 3 &&
                      "Mức độ trung bình, có thể tốt hơn với nhiều ký tự hơn."}
                    {displayStrength === 4 && "Mạnh, bạn đang làm tốt!"}
                    {displayStrength === 5 && "Rất mạnh! Tuyệt vời!"}
                  </p>
                </FieldTooltip>
              </div>

              {/* Confirm Password + Tooltip (chỉ hiện khi đã nhập) */}
              <div
                ref={confirmAnchorRef}
                className="relative"
                onFocusCapture={() => setConfirmFocused(true)}
                onBlurCapture={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (!e.currentTarget.contains(next)) setConfirmFocused(false);
                }}
              >
                <CustomPasswordInput
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  icon={FaLock}
                  error={errors.confirmPassword?.message}
                  required
                  register={register("confirmPassword", {
                    onChange: (e) =>
                      setConfirmTyped((e.target.value?.length ?? 0) > 0),
                  })}
                />
                <FieldTooltip
                  anchorRef={confirmAnchorRef}
                  open={openConfirmTooltip}
                  desktopMaxWidthPx={240}
                >
                  {confirmPasswordValue &&
                  confirmPasswordValue === passwordValue ? (
                    <div className="flex items-center gap-1.5 text-green-600 whitespace-nowrap">
                      <FaCheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Mật khẩu xác nhận khớp !
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-600 whitespace-nowrap">
                      <FaTimesCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Mật khẩu xác nhận chưa khớp !
                      </span>
                    </div>
                  )}
                </FieldTooltip>
              </div>
            </div>

            {/* Agree Terms */}
            <label className="flex items-center gap-2 text-xs md:text-sm pt-1">
              <input
                type="checkbox"
                className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                {...register("agreeTerms", { required: true })}
                required
              />
              <span>
                Tôi đồng ý với các{" "}
                <a
                  href={endPoint.TERMSOFSERVICE}
                  className="ml-0.5 text-teal-600 hover:underline hover:brightness-75"
                >
                  điều khoản dịch vụ
                </a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-gradient-to-r from-teal-600/80 via-teal-500 to-teal-600/80 hover:brightness-90
                         disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-medium py-2.5 rounded-lg
                         transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                         flex justify-center items-center"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner color="white" size="5" inline />
                  <span>Đang đăng ký...</span>
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>

            {/* Divider */}
            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="px-3 text-gray-400 text-sm">
                Hoặc đăng ký bằng
              </span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onSocialRegister?.("Google")}
                className="flex items-center justify-center p-1.5 border-2 border-gray-200 rounded-lg transition-transform duration-150 hover:scale-105 hover:bg-gray-50"
              >
                <FcGoogle className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onSocialRegister?.("Facebook")}
                className="flex items-center justify-center p-1.5 transition-transform duration-150 hover:scale-105 bg-blue-500 border-2 border-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaFacebookF className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onSocialRegister?.("Apple")}
                className="flex items-center justify-center p-1.5 transition-transform duration-150 hover:scale-105 bg-gray-900 border-2 border-gray-900 text-white rounded-lg hover:bg-black"
              >
                <FaApple className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle login */}
            <p className="text-center text-sm text-gray-600 mt-5">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={toggleView}
                className="text-teal-600 hover:underline hover:brightness-75 font-medium"
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
