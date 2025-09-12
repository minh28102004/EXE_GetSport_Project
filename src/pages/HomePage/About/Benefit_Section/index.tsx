import { useState, useEffect } from "react";
import { mainBenefits } from "./data";
import { motion } from "framer-motion";

const BenefitSection = () => {
  const [isVisible, setIsVisible] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id) {
              setIsVisible((prev) => ({
                ...prev,
                [id]: true, // chỉ set true lần đầu
              }));
              observer.unobserve(entry.target); // bỏ observe để nó chỉ chạy 1 lần
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 sm:py-18 bg-white" id="benefits">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Tại Sao Chọn Get Sport?
          </h2>
          <p className="text-xl text-gray-600">
            Những lợi ích vượt trội chỉ có tại Get Sport
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mainBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                data-animate
                data-id={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible[index] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                {/* Stats badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-md">
                  {benefit.stats}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Title + details */}
                <h3 className="font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.details}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
