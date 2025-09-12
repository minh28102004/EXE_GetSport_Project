import BannerSection from "./Banner_Section";
import CommunitySection from "./Community_Section";
import MapSection from "./Map_Section";
import ProcessSection from "./Process_Section";
import HighLightSection from "./Highlight_Section";
import CTASection from "./CTA_Section";
import CourtSection from "./Court_Section";
import FeedbackSection from "./Feedback_Section";

const MainSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 overflow-hidden">
      <BannerSection />
      <CourtSection />
      <CommunitySection />
      <MapSection />
      <HighLightSection />
      <FeedbackSection />
      <ProcessSection />
      <CTASection />
    </div>
  );
};

export default MainSection;
