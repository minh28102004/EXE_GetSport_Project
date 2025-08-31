import React, { useState, useEffect } from "react";
import BannerSection from "./Home/Banner_Section";
import CommunitySection from "./Home/Community_Section";
import MapSection from "./Home/Map_Section";
import ProcessSection from "./Home/Process_Section";
import HighLightSection from "./Home/Highlight_Section";
import CTASection from "./Home/CTA_Section";

const MainSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 overflow-hidden">
      <BannerSection />
      <CommunitySection />
      <MapSection />
      <HighLightSection />
      <ProcessSection />
      <CTASection />
    </div>
  );
};

export default MainSection;
