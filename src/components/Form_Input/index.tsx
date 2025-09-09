// src/components/Input_Form.tsx

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  icon?: React.ElementType;
  type?: string;
  required?: boolean;
  error?: string;
  // For controlled input (optional)
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // For react-hook-form
  register?: UseFormRegisterReturn;
}

// ==== TEXT INPUT ====
export const CustomTextInput: React.FC<InputProps> = ({
  label,
  name,
  placeholder = "",
  icon: Icon,
  type = "text",
  required = false,
  error,
  value,
  onChange,
  register,
}) => {
  const hasIcon = !!Icon;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {hasIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <Icon />
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          {...register}
          className={`w-full ${
            hasIcon ? "pl-10" : "pl-3"
          } pr-3 py-3 border-2 rounded-lg bg-gray-50 focus:bg-white text-sm transition-all duration-200 outline-none ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-400"
              : "border-gray-200 hover:border-teal-500/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-400/10"
          }`}
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

// ==== PASSWORD INPUT ====
export const CustomPasswordInput: React.FC<InputProps> = ({
  label,
  name,
  placeholder = "",
  icon: Icon,
  required = false,
  error,
  value,
  onChange,
  register,
}) => {
  const [show, setShow] = useState(false);
  const hasIcon = !!Icon;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        {hasIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <Icon />
          </div>
        )}
        <input
          id={name}
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          {...register}
          className={`w-full ${
            hasIcon ? "pl-10" : "pl-3"
          } pr-10 py-3 border-2 rounded-lg bg-gray-50 focus:bg-white text-sm transition-all duration-200 outline-none ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-400"
              : "border-gray-200 hover:border-teal-500/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-400/10"
          }`}
        />

        {/* Toggle Show/Hide */}
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};
