import React from "react";

export type ArrowSide = "left" | "right" | "top-left" | "top-right" | "none";

export interface TooltipCardProps {
  children: React.ReactNode;
  className?: string;
  arrow?: ArrowSide;
}

const arrowBase = "absolute w-2 h-2 rotate-45 bg-white border border-teal-300";

export default function TooltipCard({
  children,
  className = "",
  arrow = "none",
}: TooltipCardProps) {
  return (
    <div
      className={[
        "relative inline-block w-fit max-w-[min(85vw,24rem)] rounded-lg border border-teal-200 bg-white px-3 py-2 shadow-md",
        "pointer-events-auto",
        className,
      ].join(" ")}
    >
      {arrow !== "none" && (
        <div
          aria-hidden
          className={[
            arrowBase,
            arrow === "left" && "top-1/2 -translate-y-1/2 -left-1",
            arrow === "right" &&
              "top-1/2 -translate-y-1/2 -right-1 rotate-[225deg]",
            arrow === "top-left" && "-top-1 left-4",
            arrow === "top-right" && "-top-1 right-4",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}
      {children}
    </div>
  );
}
