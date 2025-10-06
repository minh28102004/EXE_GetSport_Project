import React, { useState } from "react";
import { features } from "./data";

const HighLightSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <>
      <section className="py-10 sm:py-18 bg-white">
        <div className=" mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm đặt sân hiện đại với công nghệ AI và giao diện thân
              thiện
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-teal-200 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  activeFeature === index
                    ? "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-300"
                    : "bg-white"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    activeFeature === index
                      ? "bg-teal-500 text-white"
                      : "bg-teal-100 text-teal-600"
                  }`}
                >
                  <feature.icon className="h-5 w-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HighLightSection;
