import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type UseImageZoomReturn = {
  isZoomed: boolean;
  zoomedImage: string | null;
  currentIndex: number;
  openZoom: (src: string, list: string[]) => void;
  closeZoom: () => void;
  next: () => void;
  prev: () => void;
  ZoomOverlay: React.ReactNode | null;
};

export const useImageZoom = (): UseImageZoomReturn => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomedList, setZoomedList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openZoom = (src: string, list: string[]) => {
    const index = list.findIndex((img) => img === src);
    if (index !== -1) {
      setZoomedList(list);
      setZoomedImage(src);
      setCurrentIndex(index);
      setIsZoomed(true);
    }
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomedImage(null);
    setZoomedList([]);
    setCurrentIndex(0);
  };

  const prev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setZoomedImage(zoomedList[newIndex]);
    }
  };

  const next = () => {
    if (currentIndex < zoomedList.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setZoomedImage(zoomedList[newIndex]);
    }
  };

  const ZoomOverlay =
    isZoomed && zoomedImage ? (
      <div
        className="fixed inset-0 bg-black/80 flex justify-center items-center z-[9999]"
        onClick={closeZoom}
      >
        {/* Nút Prev */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className={`absolute left-4 text-white p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition ${
            currentIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:scale-105"
          }`}
          disabled={currentIndex === 0}
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Hình ảnh */}
        <img
          src={zoomedImage}
          alt="Zoomed Preview"
          className="max-h-[90vh] max-w-[90vw] object-contain shadow-lg"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Nút Next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className={`absolute right-4 text-white p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition ${
            currentIndex === zoomedList.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:scale-105"
          }`}
          disabled={currentIndex === zoomedList.length - 1}
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    ) : null;

  return {
    isZoomed,
    zoomedImage,
    currentIndex,
    openZoom,
    closeZoom,
    next,
    prev,
    ZoomOverlay,
  };
};
