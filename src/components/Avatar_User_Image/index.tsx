import React from "react";

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-emerald-500",
];

const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

const getInitials = (name?: string): string => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0]?.toUpperCase() || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0]?.toUpperCase() : "";
  return first + last;
};

interface AvatarUserImageProps {
  name?: string;
  avatarUrl?: string;
  size?: number | string; // number in px, or Tailwind size class
  className?: string;
}

const AvatarUserImage: React.FC<AvatarUserImageProps> = ({
  name = "User",
  avatarUrl,
  size = 36,
  className = "",
}) => {
  const bgColor = getColorFromName(name);

  const isNumberSize = typeof size === "number";
  const pixelSize = isNumberSize ? `${size}px` : undefined;
  const fontSize = isNumberSize ? `${size / 2.2}px` : undefined;

  return (
    <div
      className={`relative rounded-full text-white flex items-center justify-center font-semibold overflow-hidden ${bgColor} ${className}`}
      style={
        isNumberSize
          ? {
              width: pixelSize,
              height: pixelSize,
              fontSize: fontSize,
            }
          : undefined
      }
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      ) : (
        <span className="z-10">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default AvatarUserImage;
