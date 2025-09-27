import { useEffect, useState } from "react";

/** Hook tính điểm mạnh mật khẩu 0..5, kèm nhãn & class thanh hiển thị */
export function usePasswordStrength(password: string) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let s = 0;
    if (password) {
      if (password.length >= 8) s++;
      if (/[A-Z]/.test(password)) s++;
      if (/[a-z]/.test(password)) s++;
      if (/[0-9]/.test(password)) s++;
      if (/[^A-Za-z0-9]/.test(password)) s++;
    }
    setScore(s);
  }, [password]);

  return {
    score,
    label: labelForScore(score),
    barClass: barClassFor(score),
  } as const;
}

export function labelForScore(score: number) {
  switch (score) {
    case 0:
      return "0%";
    case 1:
      return "20% - Rất yếu";
    case 2:
      return "40% - Yếu";
    case 3:
      return "60% - Trung bình";
    case 4:
      return "80% - Mạnh";
    case 5:
      return "100% - Rất mạnh";
    default:
      return "";
  }
}

export function barClassFor(score: number) {
  switch (score) {
    case 0:
      return "bg-gray-300 w-0";
    case 1:
      return "bg-red-500/80 w-1/5";
    case 2:
      return "bg-orange-400/80 w-2/5";
    case 3:
      return "bg-yellow-400 w-3/5";
    case 4:
      return "bg-lime-500 w-4/5";
    case 5:
      return "bg-green-600/80 w-full";
    default:
      return "bg-gray-200 w-0";
  }
}
