import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import AnimatedBackground from "@components/Animated_Background";

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />

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
