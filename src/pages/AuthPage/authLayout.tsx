import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import AnimatedBackground from "@components/Animated_Background";
import { FiArrowLeft } from "react-icons/fi";

const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get("view");

  const [view, setView] = useState<"login" | "register" | "forgot">("login");

  useEffect(() => {
    if (viewParam === "register") setView("register");
    else if (viewParam === "forgot") setView("forgot");
    else setView("login");
  }, [viewParam]);

  const changeView = (newView: "login" | "register" | "forgot") => {
    setSearchParams({ view: newView });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background animation */}
      <AnimatedBackground />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 group inline-flex items-center
                   px-3 py-2 rounded-full bg-white shadow-md hover:shadow-lg
                   transition-all duration-300 ring-1 ring-gray-300/60 hover:ring-teal-500/70"
        aria-label="Quay về trang chủ"
      >
        <FiArrowLeft className="w-4.5 h-4.5 text-gray-600 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-teal-600" />
        <span className="ml-1 text-sm text-gray-700 font-medium group-hover:-translate-x-1 transition-transform duration-300 group-hover:text-teal-600">
         Trang chủ
        </span>
      </Link>

      {/* Auth Container */}
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
