import React, { useState, useEffect } from "react";
import {
  Award,
} from "lucide-react";
import {
  mainBenefits as benefits,
  additionalFeatures,
} from "../data";

const BenefitSection = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Benefits Grid */}
      <section
        className="pt-12 sm:pt-18 sm:pb-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
        id="benefits"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div
            data-animate
            id="benefits-header"
            className={`text-center mb-12 transform transition-all duration-1000 ${
              isVisible["benefits-header"]
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 px-6 py-3 rounded-full text-sm font-medium mb-3">
              <Award className="w-4 h-4 mr-2" />
              Tại sao chọn chúng tôi?
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Những Lợi Ích
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {" "}
                Vượt Trội
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get Sport mang đến trải nghiệm đặt sân thể thao hoàn hảo với công
              nghệ tiên tiến và dịch vụ chuyên nghiệp, giúp bạn tận hưởng đam mê
              thể thao một cách trọn vẹn nhất.
            </p>
          </div>

          {/* Main Benefits Grid */}
          <div
            data-animate
            id="benefits-grid"
            className={`grid lg:grid-cols-3 gap-8 mb-14 transform transition-all duration-1000 delay-200 ${
              isVisible["benefits-grid"]
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-white px-8 py-4 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
                  onMouseEnter={() => setActiveTab(index)}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {benefit.stats}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      {benefit.title}
                    </h3>

                    <p className="text-teal-600 font-semibold mb-4">
                      {benefit.desc}
                    </p>

                    <p className="text-gray-600 leading-relaxed ">
                      {benefit.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Features */}
          <div
            data-animate
            id="additional-features"
            className={`bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl px-6 py-7.5 mb-16 relative overflow-hidden transform transition-all duration-1000 delay-400 ${
              isVisible["additional-features"]
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-cyan-600/10"></div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-3">
                  Tính Năng Đặc Biệt
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Những tính năng độc quyền giúp trải nghiệm của bạn trở nên
                  hoàn hảo hơn
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {additionalFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-300">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BenefitSection;
