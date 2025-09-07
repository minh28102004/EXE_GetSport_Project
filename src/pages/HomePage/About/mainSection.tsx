import {
  Users,
  Star,
  Smartphone,
  Shield,
  Sparkles,
  ArrowRight,
  Download,
} from "lucide-react";
import HeroSection from "./Hero_Section";
import StorySection from "./Story_Section";
import AppFeatureSection from "./AppFeature_Section";
import BenefitSection from "./Benefit_Section";
import TimelineSection from "./Timeline_Section";

const AboutPage = () => {
 
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StorySection />
      <AppFeatureSection />
      <BenefitSection />
      <TimelineSection />
    

      {/* Enhanced CTA */}
      <section className="py-18 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-2 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              <span className="text-sm font-medium text-white">
                Tham gia ngay hôm nay
              </span>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Sẵn sàng trải nghiệm
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                cách mới chơi cầu lông?
              </span>
            </h2>

            <p className="text-xl text-cyan-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Hãy tham gia cùng{" "}
              <span className="font-bold text-yellow-300">50,000+</span> người
              chơi khác và khám phá cách Get Sport có thể giúp bạn tận hưởng đam
              mê cầu lông một cách tốt nhất.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button className="group bg-white text-teal-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300 shadow-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Tải ứng dụng miễn phí
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-teal-600 transition-all duration-300 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Tham gia cộng đồng
              </button>
            </div>

            {/* Download Stats */}
            <div className="flex justify-center items-center space-x-8 text-cyan-100">
              <div className="flex items-center">
                <Download className="w-5 h-5 mr-2" />
                <span>100K+ lượt tải</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                <span>4.8/5 đánh giá</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>100% miễn phí</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
