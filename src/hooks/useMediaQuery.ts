import { useSyncExternalStore } from "react";

/**
 * React 18-safe media query hook
 * - SSR-safe (không đụng window trên server)
 * - Tự động resubscribe khi query đổi
 * @param query CSS media query string, ví dụ "(min-width: 768px)"
 * @param fallback Giá trị dùng trên server để tránh mismatch (mặc định: false)
 */
export default function useMediaQuery(query: string, fallback = false): boolean {
  const getMql = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query)
      : null;

  const subscribe = (onChange: () => void) => {
    const mql = getMql();
    if (!mql) return () => {};

    const handler = () => onChange();

    // Safari cũ: addListener/removeListener
    if ("addEventListener" in mql) {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } else {
      // @ts-expect-error: legacy APIs for older browsers
      mql.addListener(handler);
      // @ts-expect-error: legacy APIs for older browsers
      return () => mql.removeListener(handler);
    }
  };

  const getSnapshot = () => {
    const mql = getMql();
    return mql ? mql.matches : fallback;
  };

  const getServerSnapshot = () => fallback;

  // Re-subscribe khi query thay đổi vì subscribe/getSnapshot closured theo query
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
