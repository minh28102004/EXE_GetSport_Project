import { useState } from "react";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

type FormData = LoginFormData | RegisterFormData;

const useFormValidation = () => {
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 6;

  const validateForm = (data: FormData): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    // Username (nếu có)
    if ("username" in data) {
      if (!data.username) newErrors.username = "Tên người dùng là bắt buộc";
      else if (data.username.length < 3)
        newErrors.username = "Tên người dùng tối thiểu 3 ký tự";
    }

    // Email
    if ("email" in data) {
      if (!data.email) newErrors.email = "Email là bắt buộc";
      else if (!validateEmail(data.email))
        newErrors.email = "Email không hợp lệ";
    }

    // Password
    if ("password" in data) {
      if (!data.password) newErrors.password = "Mật khẩu là bắt buộc";
      else if (!validatePassword(data.password))
        newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    // Confirm Password (nếu có)
    if ("confirmPassword" in data) {
      if (!data.confirmPassword)
        newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
      else if (data.password !== data.confirmPassword)
        newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // Agree Terms (nếu có)
    if ("agreeTerms" in data) {
      if (!data.agreeTerms)
        newErrors.agreeTerms = "Bạn phải đồng ý với điều khoản dịch vụ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateForm };
};

export default useFormValidation;
