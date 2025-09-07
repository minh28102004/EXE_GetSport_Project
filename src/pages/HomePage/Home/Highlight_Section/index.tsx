import React, { useState, useEffect } from "react";
import { features } from "./data";

const HighLightSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <>
      <section className="py-20 bg-white">
        <div className=" mx-auto px-4 sm:px-6 lg:px-30">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm đặt sân hiện đại với công nghệ AI và giao diện thân
              thiện
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4  gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-5 rounded-2xl border border-gray-200 hover:border-teal-200 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  activeFeature === index
                    ? "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-300"
                    : "bg-white"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    activeFeature === index
                      ? "bg-teal-500 text-white"
                      : "bg-teal-100 text-teal-600"
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
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
