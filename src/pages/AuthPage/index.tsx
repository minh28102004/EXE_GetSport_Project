import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import AnimatedBackground from "@components/Animated_Background";
import { Tooltip } from "@mui/material";
import { FiArrowLeft } from "react-icons/fi";

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />

      <Tooltip title="Quay về trang chủ" arrow placement="right">
        <Link
          to="/homePage"
          className="absolute top-5 left-5 z-20 group flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-xl transition-all duration-300 ring-2 ring-gray-300/50 hover:ring-sky-400/80"
          aria-label="Quay về trang chủ"
        >
          <FiArrowLeft className="w-7 h-7 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
        </Link>
      </Tooltip>

      {/* Auth Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {isLoginView ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 50, rotateY: 20 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -50, rotateY: 10, rotateX: -5 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <Login toggleView={toggleView} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 50, rotateY: 20 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: 50, rotateY: -10, rotateX: 5 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <Register toggleView={toggleView} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
