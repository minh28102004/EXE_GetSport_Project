import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMediaQuery from "@hooks/useMediaQuery";
import TooltipCard from "./tooltipCard";
import FloatingPortal, { tooltipAnim } from "./floatingPortal";
import type { AnyRef } from "./floatingPortal";

export interface FieldTooltipProps<T extends HTMLElement = HTMLElement> {
  anchorRef: AnyRef<T>;
  open: boolean;
  children: React.ReactNode;
  /** 'auto' (mặc định): mobile inline + desktop portal; 'desktop': chỉ desktop; 'mobile': chỉ mobile */
  mode?: "auto" | "desktop" | "mobile";
  desktopOffset?: number;
  desktopMaxWidthPx?: number;
}

export default function FieldTooltip<T extends HTMLElement = HTMLElement>({
  anchorRef,
  open,
  children,
  mode = "auto",
  desktopOffset = 10,
  desktopMaxWidthPx = 280,
}: FieldTooltipProps<T>) {
  const isMdUp = useMediaQuery("(min-width: 768px)");

  const showMobile =
    open && (mode === "mobile" || (mode === "auto" && !isMdUp));
  const showDesktop =
    open && isMdUp && (mode === "desktop" || mode === "auto");

  // Mobile inline
  if (showMobile) {
    return (
      <AnimatePresence>
        <motion.div
          variants={tooltipAnim}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mt-1.5"
        >
          <TooltipCard arrow="top-left">{children}</TooltipCard>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop portal
  return (
    <AnimatePresence>
      {showDesktop && (
        <FloatingPortal
          anchorRef={anchorRef}
          show
          offset={desktopOffset}
          maxWidthPx={desktopMaxWidthPx}
        >
          {children}
        </FloatingPortal>
      )}
    </AnimatePresence>
  );
}
