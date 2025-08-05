import React from 'react';

const VideoBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/videos/badminton-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
    </div>
  );
};

export default VideoBackground;
