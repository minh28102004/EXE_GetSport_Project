import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import AnimatedBackground from "@components/Animated_Background";
import AuthBg from "@assets/bgImage.jpg";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ===== View theo query "view"
  const viewParam = searchParams.get("view");
  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  useEffect(() => {
    if (viewParam === "register") setView("register");
    else if (viewParam === "forgot") setView("forgot");
    else setView("login");
  }, [viewParam]);

  // ===== Coachmark chỉ 1 lần sau khi đăng ký, và chỉ ở view=login
  const [coach, setCoach] = useState<{ title: string; message: string } | null>(
    null
  );
  const [hintCreds, setHintCreds] = useState<{
    email?: string;
    password?: string;
  } | null>(null);
  const shownRef = useRef(false); // chặn việc hiện lại

  useEffect(() => {
    // nếu rời khỏi login thì xóa coach/hint (đảm bảo mất khi đổi view)
    if (view !== "login") {
      if (coach) setCoach(null);
      if (hintCreds) setHintCreds(null);
      return;
    }

    // chỉ bắt khi có hint=signup trong URL và chưa show lần nào
    if (shownRef.current) return;
    const params = new URLSearchParams(location.search);
    const hinted = params.get("hint") === "signup";
    if (!hinted) return;

    // dữ liệu do Register lưu tạm
    const ssEmail = sessionStorage.getItem("signup_hint_email") || undefined;
    const ssPass = sessionStorage.getItem("signup_hint_password") || undefined;

    if (ssEmail) {
      setCoach({
        title: "Tạo tài khoản thành công!",
        message:
          "Bấm nút để điền nhanh email & mật khẩu bạn vừa đăng ký (bạn vẫn có thể chỉnh trước khi đăng nhập).",
      });
      setHintCreds({ email: ssEmail, password: ssPass });
      shownRef.current = true;

      // dọn URL + state + xóa backup để lần sau ko hiện
      setTimeout(() => {
        setSearchParams(
          (prev) => {
            const sp = new URLSearchParams(prev);
            sp.set("view", "login");
            sp.delete("hint");
            sp.delete("email");
            return sp;
          },
          { replace: true }
        );

        navigate(".", { replace: true, state: {} });
        sessionStorage.removeItem("signup_hint_email");
        sessionStorage.removeItem("signup_hint_password");
      }, 0);
    }
  }, [location.search, navigate, setSearchParams, view, coach, hintCreds]);

  const changeView = (v: "login" | "register" | "forgot") => {
    setSearchParams({ view: v });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />

      <div className={`${view === "register" ? "pb-8" : "pb-0"} sm:pb-0`}>
        {/* Back to home */}
        <Link
          to="/"
          className="absolute top-4 left-4 z-20 group inline-flex items-center px-3 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 ring-1 ring-gray-300/60 hover:ring-teal-500/70"
          aria-label="Quay về trang chủ"
        >
          <FiArrowLeft className="w-4.5 h-4.5 text-gray-600 group-hover:-translate-x-1 group-hover:text-teal-600 transition-transform duration-300" />
          <span className="ml-1 text-sm text-gray-700 font-medium group-hover:-translate-x-1 group-hover:text-teal-600 transition-transform duration-300">
            Trang chủ
          </span>
        </Link>
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen px-3 sm:px-4">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -40, rotateY: 16 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -40, rotateY: 8, rotateX: -4 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <Login
                  coachmark={coach || undefined}
                  hintCreds={hintCreds || undefined}
                  toggleView={() => changeView("register")}
                  onForgotPassword={() => changeView("forgot")}
                />
              </motion.div>
            )}

            {view === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 40, rotateY: -16 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: 40, rotateY: 8, rotateX: 4 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <Register toggleView={() => changeView("login")} />
              </motion.div>
            )}

            {view === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45 }}
                className="w-full"
              >
                <ForgotPassword toggleView={() => changeView("login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
