import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  icon?: React.ElementType;
  type?: string;
  required?: boolean;
}

export const CustomTextInput: React.FC<InputProps> = ({
  label,
  name,
  placeholder = "",
  icon: Icon,
  type = "text",
  required = false,
}) => {
  return (
    <label className="block text-md font-medium text-gray-700">
      {label}
      <div className="relative mt-1">
        {Icon && (
          <div className="absolute inset-y-0 left-2 flex items-center text-gray-400 pointer-events-none">
            <Icon />
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BFB3] px-2 py-2 w-full h-10 transition-all duration-200 ${
            Icon ? "pl-9" : ""
          }`}
        />
      </div>
    </label>
  );
};

export const CustomPasswordInput: React.FC<InputProps> = ({
  label,
  name,
  placeholder = "",
  icon: Icon,
  required = false,
}) => {
  const [show, setShow] = useState(false);

  return (
    <label className="block text-md font-medium text-gray-700">
      {label}
      <div className="relative mt-1">
        {Icon && (
          <div className="absolute inset-y-0 left-2 flex items-center text-gray-400 pointer-events-none">
            <Icon />
          </div>
        )}
        <input
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BFB3] px-2 py-2 pr-10 w-full h-10 transition-all duration-200 ${
            Icon ? "pl-9" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </label>
  );
};
