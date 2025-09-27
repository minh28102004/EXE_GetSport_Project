import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  icon?: React.ElementType;
  type?: string;
  required?: boolean;
  error?: string;

  // Controlled (optional)
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // react-hook-form
  register?: UseFormRegisterReturn;
}

/* ===================== TEXT INPUT (Floating Label) ===================== */
export const CustomTextInput: React.FC<InputProps> = ({
  label,
  name,
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
    <div className="relative">
      {/* Left icon */}
      {hasIcon && (
        <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
          <Icon />
        </div>
      )}

      {/* Input (use placeholder=' ' for :placeholder-shown trick) */}
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder=" "
        aria-invalid={!!error}
        {...register}
        className={[
          "peer w-full border-2 rounded-lg bg-gray-50 focus:bg-white text-sm transition-all duration-200 outline-none",
          hasIcon ? "pl-10 pr-3 py-3" : "px-3 py-3",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-400"
            : "border-gray-200 hover:border-teal-500/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-400/10",
          // Ẩn placeholder thật, chỉ dùng label nổi
          "placeholder-transparent",
        ].join(" ")}
      />

      {/* Floating label */}
      <label
        htmlFor={name}
        className={[
          "absolute pointer-events-none transition-all",
          // vị trí mặc định (chưa nhập / chưa focus)
          "top-1/2 -translate-y-1/2 text-sm text-gray-500",
          hasIcon ? "left-10" : "left-3",

          // khi focus hoặc có value
          "peer-focus:top-0 peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:text-teal-600",
          "peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-2.5 peer-[&:not(:placeholder-shown)]:text-xs",

          // khi nổi thì đẩy label sát viền hơn (left-2 thay vì left-3/left-10)
          hasIcon
            ? "peer-focus:left-8 peer-[&:not(:placeholder-shown)]:left-8"
            : "peer-focus:left-2 peer-[&:not(:placeholder-shown)]:left-2",

          "px-1 bg-gray-50 peer-focus:bg-white peer-[&:not(:placeholder-shown)]:bg-white",
          error ? "text-red-600 peer-focus:text-red-600" : "",
        ].join(" ")}
      >
        {label}
      </label>

      {/* Error */}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

/* ===================== PASSWORD INPUT (Floating Label) ===================== */
export const CustomPasswordInput: React.FC<InputProps> = ({
  label,
  name,
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
    <div className="relative">
      {/* Left icon */}
      {hasIcon && (
        <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
          <Icon />
        </div>
      )}

      {/* Input */}
      <input
        id={name}
        name={name}
        type={show ? "text" : "password"}
        required={required}
        value={value}
        onChange={onChange}
        placeholder=" "
        aria-invalid={!!error}
        {...register}
        className={[
          "peer w-full border-2 rounded-lg bg-gray-50 focus:bg-white text-sm transition-all duration-200 outline-none",
          hasIcon ? "pl-10 pr-10 py-3" : "pl-3 pr-10 py-3",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-400"
            : "border-gray-200 hover:border-teal-500/30 focus:border-teal-500 focus:ring-1 focus:ring-teal-400/10",
          "placeholder-transparent",
        ].join(" ")}
      />

      {/* Toggle Show/Hide */}
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        onMouseDown={(e) => e.preventDefault()}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        tabIndex={-1}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>

      {/* Floating label */}
      <label
        htmlFor={name}
        className={[
          "absolute pointer-events-none transition-all",
          // vị trí mặc định (chưa nhập / chưa focus)
          "top-1/2 -translate-y-1/2 text-sm text-gray-500",
          hasIcon ? "left-10" : "left-3",

          // khi focus hoặc có value
          "peer-focus:top-0 peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:text-teal-600",
          "peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-2.5 peer-[&:not(:placeholder-shown)]:text-xs",

          // khi nổi thì đẩy label sát viền hơn (left-2 thay vì left-3/left-10)
          hasIcon
            ? "peer-focus:left-8 peer-[&:not(:placeholder-shown)]:left-8"
            : "peer-focus:left-2 peer-[&:not(:placeholder-shown)]:left-2",

          "px-1 bg-gray-50 peer-focus:bg-white peer-[&:not(:placeholder-shown)]:bg-white",
          error ? "text-red-600 peer-focus:text-red-600" : "",
        ].join(" ")}
      >
        {label}
      </label>

      {/* Error */}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};
