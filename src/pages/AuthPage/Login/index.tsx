import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaFacebookF, FaApple, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LuSparkles, LuShieldCheck, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CustomTextInput, CustomPasswordInput } from "@components/Form_Input";
import LoadingSpinner from "@components/Loading_Spinner";
import useCustomForm from "@hooks/useReactHookForm";
import { GiShuttlecock } from "react-icons/gi";
import { useLoginMutation } from "@/redux/api/auth/authApi";
import { setLoggedIn } from "@redux/features/auth/authSlice";
import { routeForRole } from "@utils/routeForRole";

interface FormData {
  email: string;
  password: string;
  remember?: boolean;
}
interface LoginProps {
  onLogin?: (data: FormData) => void;
  onSocialLogin?: (platform: string) => void;
  onForgotPassword?: () => void;
  toggleView?: () => void;
  coachmark?: { title: string; message: string };
  hintCreds?: { email?: string; password?: string };
}

const Login: React.FC<LoginProps> = ({
  onLogin,
  onSocialLogin,
  onForgotPassword,
  toggleView,
  coachmark,
  hintCreds,
}) => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleFormSubmit, errors, isSubmitting, reset, watch } =
    useCustomForm<FormData>({
      defaultValues: { email: "", password: "", remember: false },
      onSubmit: async (data) => {
        try {
          const res = await login({
            email: data.email,
            password: data.password,
          }).unwrap();
          const { token, fullname, email, role } = res.data;
          dispatch(
            setLoggedIn({
              token,
              user: { fullname, email, role },
              remember: !!data.remember,
            })
          );
          toast.success("Đăng nhập thành công");
          reset();
          onLogin?.(data);
          navigate(routeForRole(role), { replace: true });
        } catch (e: any) {
          toast.error(e?.data?.message || e?.error || "Đăng nhập thất bại");
        }
      },
    });

  // Hiện coachmark khi có dữ liệu
  const [showCoach, setShowCoach] = useState(false);
  useEffect(() => {
    if (coachmark) setShowCoach(true);
  }, [coachmark]);

  // ====== CANH COACHMARK NGANG VỚI KHỐI INPUT EMAIL + PASSWORD ======
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputsBlockRef = useRef<HTMLDivElement>(null);
  const [coachTop, setCoachTop] = useState<number | null>(null);

  useLayoutEffect(() => {
    const calc = () => {
      if (!wrapperRef.current || !inputsBlockRef.current) return;
      const wrap = wrapperRef.current.getBoundingClientRect();
      const block = inputsBlockRef.current.getBoundingClientRect();
      // Đặt top ở giữa khối email + password (đơn vị px, relative theo wrapper)
      const middle = block.top - wrap.top + block.height / 2;
      setCoachTop(middle);
    };
    // đo khi mount / khi showCoach / khi cửa sổ resize
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [showCoach]);

  const rememberChecked = watch("remember");

  // Nút "Điền vào form" trên coachmark
  const fillFromHint = () => {
    const cur = watch();
    reset({
      email: hintCreds?.email ?? cur.email ?? "",
      password: hintCreds?.password ?? cur.password ?? "",
      remember: cur.remember ?? false,
    });
  };

  // Nút "Bật ngay" cho 'Ghi nhớ đăng nhập'
  const turnOnRemember = () => {
    const cur = watch();
    reset({
      email: cur.email ?? "",
      password: cur.password ?? "",
      remember: true,
    });
  };

  return (
    <div className="flex items-center justify-center p-2">
      {/* Wrapper phải relative + overflow-visible để coachmark không bị cắt */}
      <div
        ref={wrapperRef}
        className="relative w-full max-w-sm sm:max-w-[420px] overflow-visible"
      >
        {/* COACHMARK — bên phải form khi >= sm, canh dọc ngang inputs */}
        {coachmark && showCoach && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              hidden sm:block                /*  Ẩn trên mobile */F
              pointer-events-auto
              sm:absolute sm:left-full sm:ml-4 sm:w-80
              w-[92%] mx-auto sm:mx-0 mt-2 sm:mt-0
              z-50 sm:-translate-y-1/2"
            style={{ top: coachTop ?? 0 }}
          >
            {/* COACHMARK CARD */}
            <div className="relative rounded-xl border border-teal-200 bg-white shadow-[0_10px_30px_rgba(13,148,136,0.15)] p-3">
              {/* Arrow trỏ sang form (ẩn trên mobile) */}
              <span
                aria-hidden
                className="
      hidden sm:block
      absolute -left-2 top-1/2 -translate-y-1/2
      w-4 h-4
      bg-white
     border-l border-teal-200
      rotate-45
      shadow-[0_4px_12px_rgba(13,148,136,0.10)]
    "
              />

              {/* Close */}
              <button
                onClick={() => setShowCoach(false)}
                className="absolute -top-2 -right-2 bg-teal-600 text-white rounded-full p-1 shadow-md hover:brightness-110"
                aria-label="Đóng gợi ý"
              >
                <LuX size={14} />
              </button>

              {/* ====== HEADER: icon + title cùng hàng ====== */}
              <div className="flex items-center gap-2">
                <div className="shrink-0 rounded-lg p-2 bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <LuSparkles className="w-5 h-5 text-teal-600" />
                </div>
                <span className="font-semibold text-gray-800">
                  {coachmark.title}
                </span>
              </div>

              {/* ====== BODY: tất cả phần còn lại xuống dưới icon ====== */}
              <div className="mt-2 text-sm">
                <div className="text-gray-600">{coachmark.message}</div>

                {hintCreds?.email && (
                  <div className="mt-2 text-xs text-gray-500">
                    Email vừa đăng ký:{" "}
                    <span className="font-medium text-gray-700">
                      {hintCreds.email}
                    </span>
                  </div>
                )}

                {/* Gợi ý ghi nhớ đăng nhập */}
                <div className="mt-3 rounded-md bg-teal-50 border border-teal-100 px-2.5 py-2">
                  <div className="flex items-start gap-2">
                    <LuShieldCheck className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                    <div className="text-[13px] text-teal-800">
                      <div className="font-medium">
                        Gợi ý: Bật “Ghi nhớ đăng nhập”
                      </div>
                      <div className="text-teal-700/90">
                        Dùng trên thiết bị cá nhân để lần sau không cần nhập
                        lại.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fillFromHint}
                    className="shrink-0 px-3 py-2 rounded-md bg-teal-600 text-white text-xs font-medium hover:brightness-110 shadow-sm whitespace-nowrap"
                  >
                    Điền vào form
                  </button>

                  <span className="text-[12px] text-teal-700">
                    Bạn vẫn chỉnh lại được trước khi gửi.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Card */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 via-teal-600/70 to-teal-600/80 py-3 text-center">
            <div className="mx-auto w-14 h-14 bg-white/20 rounded-2xl transition-transform duration-300 hover:rotate-12 flex items-center justify-center mb-1.5">
              <GiShuttlecock className="w-7 h-7 text-white " />
            </div>

            <h1 className="text-lg md:text-xl font-bold text-white mb-1">
              Get Sport
            </h1>
            <p className="text-teal-100 text-xs md:text-sm">
              Nền tảng đặt sân cầu lông hàng đầu
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="px-5 md:px-6 pb-4 pt-3">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Đăng nhập
              </h2>
            </div>

            <div className="space-y-3">
              {/* Khối input — ref để canh coachmark */}
              <div className="space-y-5 mb-8" ref={inputsBlockRef}>
                <CustomTextInput
                  label="Email"
                  name="email"
                  icon={FaEnvelope}
                  error={errors.email?.message}
                  required
                  type="email"
                  autoComplete="username"
                  register={register("email")}
                />
                <CustomPasswordInput
                  label="Mật khẩu"
                  name="password"
                  icon={FaLock}
                  error={errors.password?.message}
                  required
                  autoComplete="current-password"
                  register={register("password")}
                />
              </div>

              <div className="flex items-center justify-between text-xs md:text-sm mt-2 relative">
                <label
                  className="inline-flex items-center gap-2"
                  id="remember-area"
                >
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="ml-0.5 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
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

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-gradient-to-r from-teal-600/80 via-teal-500 to-teal-600/80 hover:brightness-90 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner color="white" size="6" inline />
                    <span>Đang đăng nhập...</span>
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>

            <div className="my-5 flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="px-3 text-gray-400 text-sm">Hoặc</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <button
                type="button"
                onClick={() => onSocialLogin?.("Google")}
                className="flex items-center justify-center p-1.5 border-2 border-gray-200 rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-50"
              >
                <FcGoogle className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onSocialLogin?.("Facebook")}
                className="flex items-center justify-center p-1.5 hover:scale-105 bg-blue-500 border-2 border-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform duration-200"
              >
                <FaFacebookF className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onSocialLogin?.("Apple")}
                className="flex items-center justify-center p-1.5 hover:scale-105 bg-gray-900 border-2 border-gray-900 text-white rounded-lg hover:bg-black transition-transform duration-200"
              >
                <FaApple className="w-5 h-5" />
              </button>
            </div>

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
