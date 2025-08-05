import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

interface ErrorMessageProps {
  message?: string | { message?: string; title?: string };
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message = "Something went wrong" }) => {
  const parsedMessage =
    typeof message === "string"
      ? message
      : message?.message || message?.title || "An unexpected error occurred.";

  return (
    <div className="flex items-center justify-center space-x-2">
      <FaExclamationCircle className="h-6 w-6 text-red-600" />
      <p className="text-lg font-medium text-red-600">{parsedMessage}</p>
    </div>
  );
};

export default ErrorMessage;
