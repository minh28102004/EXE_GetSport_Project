import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import TooltipCard from "./tooltipCard";
import type { ArrowSide } from "./tooltipCard";

export const tooltipAnim = {
  hidden: { opacity: 0, y: 6, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16 } },
  exit: { opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.12 } },
} as const;

export type AnyRef<T extends HTMLElement> =
  | React.RefObject<T>
  | React.MutableRefObject<T | null>;

export interface FloatingPortalProps<T extends HTMLElement = HTMLElement> {
  anchorRef: AnyRef<T>;
  show: boolean;
  children: React.ReactNode;
  offset?: number;
  maxWidthPx?: number;
}

export default function FloatingPortal<T extends HTMLElement = HTMLElement>({
  anchorRef,
  show,
  children,
  offset = 10,
  maxWidthPx = 280,
}: FloatingPortalProps<T>) {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: -9999,
    left: -9999,
    transform: "translate(0,-50%)",
    zIndex: 9999,
    pointerEvents: "none", // wrapper ko nhận tương tác
  });
  const [arrow, setArrow] = useState<ArrowSide>("left");

  const getCurrent = () =>
    (anchorRef as React.RefObject<T> | React.MutableRefObject<T | null>)
      .current;

  const updatePos = useCallback(() => {
    const el = getCurrent();
    if (!el) return;
    const r = el.getBoundingClientRect();

    const spaceRight = window.innerWidth - r.right;
    const spaceLeft = r.left;
    const margin = 24;

    const canRight = spaceRight >= maxWidthPx + margin;
    const canLeft = spaceLeft >= maxWidthPx + margin;
    const preferRight = spaceRight >= spaceLeft;
    const placeRight = canRight || (!canLeft && preferRight);

    setArrow(placeRight ? "left" : "right");

    const rawLeft = placeRight ? r.right + offset : r.left - offset;
    const clampedLeft = Math.min(Math.max(rawLeft, 8), window.innerWidth - 8);

    setStyle((prev) => ({
      ...prev,
      top: r.top + r.height / 2,
      left: clampedLeft,
      transform: `translate(${placeRight ? "0,-50%" : "-100%,-50%"})`,
    }));
  }, [anchorRef, maxWidthPx, offset]);

  useLayoutEffect(() => {
    if (show) updatePos();
  }, [show, updatePos]);

  useEffect(() => {
    if (!show) return;
    let frame = 0;
    const onScrollOrResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        updatePos();
      });
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize as any);
      window.removeEventListener("resize", onScrollOrResize as any);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [show, updatePos]);

  if (!show) return null;

  return createPortal(
    <div style={style} className="z-[9999] pointer-events-none">
      <motion.div
        variants={tooltipAnim}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <TooltipCard arrow={arrow}>{children}</TooltipCard>
      </motion.div>
    </div>,
    document.body
  );
}
